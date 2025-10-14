import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

/* API & Upload */
const POSTS = "http://localhost:8080/posts";
const PLACEHOLDER = "/img/placeholder.png";

const CLOUD_NAME = "dbh9eggj2";
const UPLOAD_PRESET = "project";

async function uploadToCloudinary(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: fd,
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.message || "Upload failed");
  return data.secure_url as string;
}

function transformCloudinaryUrl(url: string): string {
  const marker = "/image/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;
  const prefix = url.slice(0, i + marker.length);
  const suffix = url.slice(i + marker.length);
  return prefix + "c_fill,ar_16:9,g_auto,q_auto:good,f_auto/" + suffix;
}

/* Types */
export type Post = {
  id?: string | number;
  title: string;
  date: string;
  desc: string;
  category: string;
  image?: string;
  status?: "public" | "private";
  authorId?: string | number;
  authorEmail?: string;
  isMine?: boolean;
  createdAt?: string;
};

export type Category = { id: string | number; name: string };

const MOODS = ["😊 Happy", "😐 Neutral", "😢 Sad", "😠 Angry"];

type Props = {
  categories: Category[];
  initial?: Post;
  onClose?: () => void;
  onSaved?: () => void;
};

const AddArticleForm: React.FC<Props> = ({ categories, initial, onClose, onSaved }) => {
  const isEdit = !!initial;
  const firstCate = useMemo(() => categories[0]?.name || "", [categories]);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? firstCate);
  const [mood, setMood] = useState(MOODS[0]); // UI-only
  const [content, setContent] = useState(initial?.desc ?? "");
  const [status, setStatus] = useState<"public" | "private">(initial?.status ?? "public");
  const [file, setFile] = useState<File | null>(null);

  // Preview ảnh (nếu chọn file mới)
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Ảnh hiện có của bài (khi SỬA)
  const currentImage = useMemo(() => {
    const src = initial?.image || PLACEHOLDER;
    return transformCloudinaryUrl(src);
  }, [initial?.image]);

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  /* ===== Validation ===== */
  const titleOk = title.trim().length > 0;
  const contentOk = content.trim().length > 0;
  const imageOk = isEdit ? true : !!file; // thêm mới phải có ảnh
  const canSubmit = titleOk && contentOk && imageOk && !submitting;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!titleOk || !contentOk || !imageOk) {
      setMessage({
        type: "err",
        text: !titleOk
          ? "Vui lòng nhập tiêu đề."
          : !contentOk
          ? "Vui lòng nhập nội dung."
          : "Vui lòng chọn ảnh trước khi thêm bài.",
      });
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = initial?.image || "";
      if (file) imageUrl = await uploadToCloudinary(file);
      if (imageUrl) imageUrl = transformCloudinaryUrl(imageUrl);

      let owner: Partial<Post> = {};
      try {
        const raw = sessionStorage.getItem("authUser");
        const me = raw ? JSON.parse(raw) : null;
        if (me && !isEdit) owner = { authorId: me.id, authorEmail: me.email, isMine: true };
      } catch {}

      // Dữ liệu lưu
      const base: Post = {
        title,
        category,
        date: initial?.date ?? new Date().toISOString().slice(0, 10),
        createdAt: initial?.createdAt ?? new Date().toISOString(),
        desc: content,
        image: imageUrl || PLACEHOLDER,
        status,
      };

      const body: Post = isEdit
        ? {
            ...base,
            authorId: (initial as any)?.authorId,
            authorEmail: (initial as any)?.authorEmail,
            isMine: (initial as any)?.isMine,
          }
        : { ...base, ...owner };

      if (isEdit) await axios.put(`${POSTS}/${initial!.id}`, body);
      else await axios.post(POSTS, body);

      onSaved?.();
      setMessage({ type: "ok", text: isEdit ? "Lưu bài viết thành công." : "Tạo bài viết thành công." });

      if (!isEdit) {
        setTitle("");
        setCategory(firstCate);
        setMood(MOODS[0]);
        setContent("");
        setStatus("public");
        setFile(null);
      }
    } catch (err: any) {
      setMessage({ type: "err", text: err?.message || "Có lỗi xảy ra" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <style>{`select::-ms-expand{display:none;}`}</style>

      <div className="mb-6 flex items-center justify-end pt-5">
        <button
          type="button"
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-400 text-gray-500 hover:border-black hover:text-black"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <form className="flex flex-col gap-6" onSubmit={submit} noValidate>
        <div>
          <label className="mb-1 block text-sm font-semibold">Title:</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-gray-300 bg-white px-4 py-2"
            placeholder="Enter article title"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold">Article Categories:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded border border-gray-300 bg-gray-50 px-4 py-2 text-sm appearance-none"
            style={{ backgroundImage: "none" }}
          >
            {categories.map((c) => (
              <option key={String(c.id)} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold">Mood:</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full rounded border border-gray-300 bg-gray-50 px-4 py-2 text-sm appearance-none"
            style={{ backgroundImage: "none" }}
          >
            {MOODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Content:</label>
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full resize-none rounded border border-gray-300 bg-white px-4 py-2"
            placeholder="Write your article content here..."
          />
        </div>

        <div className="max-w-[300px]">
          <label className="mb-2 block text-sm font-semibold">Upload:</label>
          <div className="relative rounded border-2 border-dashed border-gray-300 p-6">
            <label className="block w-fit cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-8 w-8 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.88A5 5 0 0117 9a4 4 0 01-.88 7.88M12 12V8m0 0l-3 3m3-3l3 3" />
              </svg>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {file && <p className="mt-2 text-xs text-gray-500">Selected: {file.name}</p>}
          </div>

          {isEdit && !preview && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Ảnh hiện tại:</p>
              <div className="relative aspect-[16/9] w-full max-w-[420px] overflow-hidden rounded-lg border">
                <img
                  src={currentImage}
                  alt="Current image"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          {preview && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Ảnh mới (chưa lưu):</p>
              <div className="relative aspect-[16/9] w-full max-w-[420px] overflow-hidden rounded-lg border">
                <img
                  src={preview}
                  alt="New selected preview"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="mt-2 text-xs text-gray-600 hover:underline"
                title="Bỏ ảnh vừa chọn"
              >
                Bỏ ảnh vừa chọn
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 -mt-2">
          <label className="text-sm font-semibold">Status:</label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={status === "public"} onChange={() => setStatus("public")} />
            <span>public</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={status === "private"} onChange={() => setStatus("private")} />
            <span>private</span>
          </label>
        </div>

        <div className="flex items-center gap-3 -mt-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
          >
            {submitting ? (isEdit ? "Saving..." : "Adding...") : isEdit ? "Save" : "Add"}
          </button>

          {message && (
            <span className={`text-sm ${message.type === "ok" ? "text-green-700" : "text-red-600"}`}>
              {message.text}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddArticleForm;
