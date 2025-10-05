import React, { useState } from "react";

type FormState = {
  title: string;
  category: string;
  mood: string;
  content: string;
  status: "public" | "private";
};

const AddArticleForm: React.FC<{ onClose?: () => void; apiUrl?: string }> = ({
  onClose,
  apiUrl = "/api/articles", // đổi sang endpoint thật của bạn khi có server
}) => {
  const [form, setForm] = useState<FormState>({
    title: "",
    category: "",
    mood: "",
    content: "",
    status: "public",
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const onChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((s) => ({ ...s, [key]: e.target.value }));
    };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    try {
      // Gửi dạng FormData để hỗ trợ file upload
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("category", form.category);
      fd.append("mood", form.mood);
      fd.append("content", form.content);
      fd.append("status", form.status);
      if (file) fd.append("image", file);

      const res = await fetch(apiUrl, {
        method: "POST",
        body: fd,
        // KHÔNG set Content-Type khi dùng FormData (trình duyệt tự set boundary)
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed with ${res.status}`);
      }

      setMessage({ type: "ok", text: "Tạo bài viết thành công." });
      // Reset form nếu muốn
      setForm({ title: "", category: "", mood: "", content: "", status: "public" });
      setFile(null);
    } catch (err: any) {
      setMessage({ type: "err", text: `Có lỗi xảy ra: ${err?.message || "Unknown"}` });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-end">
        <button
          type="button"
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-400 text-gray-500 hover:border-black hover:text-black"
          aria-label="Close"
          title="Close"
        >
          ×
        </button>
      </div>

      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        {/* Title */}
        <div>
          <label className="mb-1 block text-sm font-semibold">Title:</label>
          <input
            type="text"
            value={form.title}
            onChange={onChange("title")}
            className="w-full rounded border border-gray-300 px-4 py-2"
            placeholder="Enter article title"
            required
          />
        </div>

        {/* Categories */}
        <div>
          <label className="mb-1 block text-sm font-bold">Article Categories:</label>
          <input
            type="text"
            value={form.category}
            onChange={onChange("category")}
            className="w-full rounded border border-gray-300 px-4 py-2 placeholder-gray-400"
            placeholder="Enter category"
            required
          />
          {/* Nếu categories là danh sách động, sau này đổi input → <select> + GET /categories để đổ options */}
        </div>

        {/* Mood */}
        <div>
          <label className="mb-1 block text-sm font-bold">Mood:</label>
          <input
            type="text"
            value={form.mood}
            onChange={onChange("mood")}
            className="w-full rounded border border-gray-300 px-4 py-2 placeholder-gray-400"
            placeholder="😊 Happy"
          />
        </div>

        {/* Content */}
        <div>
          <label className="mb-1 block text-sm font-semibold">Content:</label>
          <textarea
            rows={4}
            value={form.content}
            onChange={onChange("content")}
            className="w-full resize-none rounded border border-gray-300 px-4 py-2 placeholder-gray-400"
            placeholder="Write your article content here..."
            required
          />
        </div>

        {/* Status */}
        <div className="flex items-center gap-6">
          <label className="text-sm font-semibold">Status:</label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="public"
              checked={form.status === "public"}
              onChange={() => setForm((s) => ({ ...s, status: "public" }))}
            />
            <span>public</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="private"
              checked={form.status === "private"}
              onChange={() => setForm((s) => ({ ...s, status: "private" }))}
            />
            <span>private</span>
          </label>
        </div>

        {/* File Upload */}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.88A5 5 0 0117 9a4 4 0 01-.88 7.88M12 12V8m0 0l-3 3m3-3l3 3" />
              </svg>
              <input type="file" className="hidden" onChange={onPickFile} accept="image/*" />
            </label>

            <p className="mt-4 text-left text-sm text-gray-600">
              Browse and choose the files you want to upload from your computer.
            </p>

            {file && (
              <p className="mt-2 text-xs text-gray-500">Selected: {file.name}</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
          >
            {submitting ? "Adding..." : "Add"}
          </button>

          {message && (
            <span
              className={`text-sm ${
                message.type === "ok" ? "text-green-700" : "text-red-600"
              }`}
            >
              {message.text}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddArticleForm;
