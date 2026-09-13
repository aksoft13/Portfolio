"use client";

import { useState, useEffect, useCallback } from "react";
import ThumbnailCropper from "@/components/ThumbnailCropper";

interface VideoItem {
  type: string;
  url: string;
}

interface Project {
  id: number;
  title: string;
  description: string | null;
  category: string;
  year: number;
  thumbnail: string | null;
  thumbPosition: string | null;
  location: string | null;
  videoUrl: string | null;
  videoType: string | null;
  videoFile: string | null;
  videos: VideoItem[];
  videoLayout: string;
  images: string[];
  order: number;
  featured: boolean;
}

const emptyForm = {
  title: "",
  description: "",
  category: "",
  year: new Date().getFullYear().toString(),
  thumbnail: "",
  location: "",
  videoUrl: "",
  videoType: "youtube",
  videoFile: "",
  videos: [] as VideoItem[],
  videoLayout: "stack",
  images: [] as string[],
  order: "0",
  featured: false,
  thumbPosition: "50% 50%",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"projects" | "resume" | "resume-import">("projects");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Check auth on mount
  useEffect(() => {
    fetch("/api/admin/me").then((r) => {
      setAuthed(r.ok);
    }).catch(() => setAuthed(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm),
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      const data = await res.json();
      setLoginError(data.error || "로그인 실패");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
  };

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) setProjects(await res.json());
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (authed) fetchProjects();
  }, [authed, fetchProjects]);

  // Loading
  if (authed === null) {
    return <div className="flex items-center justify-center min-h-[60vh] text-muted">Loading...</div>;
  }

  // Login screen
  if (!authed) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-5">
          <h1 className="text-2xl font-bold text-center mb-8">Admin Login</h1>
          {loginError && (
            <p className="text-sm text-red-400 text-center">{loginError}</p>
          )}
          <div>
            <label className="block text-sm text-muted mb-1.5">Email</label>
            <input
              type="email"
              required
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-card-bg border border-border rounded-lg text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Password</label>
            <input
              type="password"
              required
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full px-4 py-2.5 bg-card-bg border border-border rounded-lg text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-white text-black rounded-lg font-medium hover:bg-accent transition-colors"
          >
            로그인
          </button>
        </form>
      </div>
    );
  }

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "thumbnail" | "videoFile" | "images"
  ) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        urls.push(data.url);
      }
    }

    if (field === "images") {
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } else {
      setForm((prev) => ({ ...prev, [field]: urls[0] || "" }));
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm(emptyForm);
      setEditingId(null);
      fetchProjects();
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description || "",
      category: project.category,
      year: project.year.toString(),
      thumbnail: project.thumbnail || "",
      location: project.location || "",
      videoUrl: project.videoUrl || "",
      videoType: project.videoType || "youtube",
      videoFile: project.videoFile || "",
      videos: project.videos || [],
      videoLayout: project.videoLayout || "stack",
      images: project.images,
      order: project.order.toString(),
      featured: project.featured,
      thumbPosition: project.thumbPosition || "50% 50%",
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) fetchProjects();
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = async (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...projects];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);

    setDragIndex(null);
    setDragOverIndex(null);

    const updates = reordered.map((p, i) =>
      fetch(`/api/projects/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, order: i }),
      })
    );
    await Promise.all(updates);
    fetchProjects();
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-card-bg border border-border rounded-lg text-foreground focus:outline-none focus:border-foreground/50 transition-colors";
  const labelClass = "block text-sm text-muted mb-1.5";

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-muted border border-border rounded-lg hover:text-foreground hover:bg-card-bg transition-colors"
        >
          로그아웃
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-border">
        <button
          onClick={() => setTab("projects")}
          className={`pb-3 text-sm font-medium transition-colors ${
            tab === "projects"
              ? "text-foreground border-b-2 border-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          Projects
        </button>
        <button
          onClick={() => setTab("resume")}
          className={`pb-3 text-sm font-medium transition-colors ${
            tab === "resume"
              ? "text-foreground border-b-2 border-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          Resume
        </button>
        <button
          onClick={() => setTab("resume-import")}
          className={`pb-3 text-sm font-medium transition-colors ${
            tab === "resume-import"
              ? "text-foreground border-b-2 border-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          LinkedIn Import
        </button>
      </div>

      {tab === "projects" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div>
            <h2 className="text-xl font-semibold mb-6">
              {editingId ? "프로젝트 수정" : "새 프로젝트"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>제목 *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>카테고리 *</label>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    placeholder="e.g. Trailer, Promo"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>연도 *</label>
                  <input
                    type="number"
                    required
                    value={form.year}
                    onChange={(e) =>
                      setForm({ ...form, year: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>위치</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="e.g. Seoul, Korea"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>설명</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={4}
                  className={inputClass}
                />
              </div>

              {/* Thumbnail */}
              <div>
                <label className={labelClass}>썸네일</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={form.thumbnail}
                    onChange={(e) =>
                      setForm({ ...form, thumbnail: e.target.value })
                    }
                    placeholder="URL 또는 파일 업로드"
                    className={inputClass}
                  />
                  <label className="shrink-0 px-4 py-2.5 bg-border rounded-lg cursor-pointer hover:bg-foreground/20 transition-colors text-sm">
                    업로드
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUpload(e, "thumbnail")}
                    />
                  </label>
                </div>
              </div>

              {/* Thumbnail Cropper */}
              {form.thumbnail && (
                <ThumbnailCropper
                  src={form.thumbnail}
                  objectPosition={form.thumbPosition}
                  onChange={(pos) => setForm({ ...form, thumbPosition: pos })}
                />
              )}

              {/* Videos */}
              <div>
                <label className={labelClass}>영상 ({form.videos.length}개)</label>
                <div className="space-y-2">
                  {form.videos.map((video, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <select
                        value={video.type}
                        onChange={(e) => {
                          const updated = [...form.videos];
                          updated[i] = { ...updated[i], type: e.target.value };
                          setForm({ ...form, videos: updated });
                        }}
                        className="w-32 shrink-0 px-3 py-2.5 bg-card-bg border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-foreground/50 transition-colors"
                      >
                        <option value="youtube">YouTube</option>
                        <option value="vimeo">Vimeo</option>
                        <option value="google">Google Drive</option>
                      </select>
                      <input
                        type="text"
                        value={video.url}
                        onChange={(e) => {
                          const updated = [...form.videos];
                          updated[i] = { ...updated[i], url: e.target.value };
                          setForm({ ...form, videos: updated });
                        }}
                        placeholder={video.type === "google" ? "Google Drive 공유 링크" : "영상 URL"}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setForm({
                            ...form,
                            videos: form.videos.filter((_, j) => j !== i),
                          });
                        }}
                        className="shrink-0 p-2 text-muted hover:text-red-400 transition-colors"
                        title="삭제"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      videos: [...form.videos, { type: "youtube", url: "" }],
                    })
                  }
                  className="mt-2 px-4 py-2 text-sm border border-dashed border-border rounded-lg text-muted hover:text-foreground hover:border-foreground/30 transition-colors w-full"
                >
                  + 영상 추가
                </button>
                {form.videos.length >= 2 && (
                  <div className="mt-3">
                    <label className={labelClass}>영상 레이아웃</label>
                    <select
                      value={form.videoLayout}
                      onChange={(e) =>
                        setForm({ ...form, videoLayout: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-card-bg border border-border rounded-lg text-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                    >
                      <option value="stack">세로 정렬 (1열)</option>
                      <option value="side">좌우 정렬 (2열)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Images */}
              <div>
                <label className={labelClass}>포스터 / 스틸컷</label>
                <label className="block w-full px-4 py-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-foreground/30 transition-colors text-center text-sm text-muted">
                  {uploading
                    ? "업로드 중..."
                    : "클릭하여 이미지 추가 (여러 장 가능)"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleUpload(e, "images")}
                  />
                </label>
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {form.images.map((img, i) => (
                      <div
                        key={i}
                        className="relative group w-20 h-14 bg-card-bg rounded overflow-hidden border border-border"
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>정렬 순서</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) =>
                      setForm({ ...form, order: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) =>
                        setForm({ ...form, featured: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-white text-black rounded-lg font-medium hover:bg-accent transition-colors"
                >
                  {editingId ? "수정" : "추가"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyForm);
                    }}
                    className="px-6 py-2.5 border border-border rounded-lg text-muted hover:text-foreground transition-colors"
                  >
                    취소
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div>
            <h2 className="text-xl font-semibold mb-6">
              등록된 프로젝트 ({projects.length})
            </h2>
            <div className="space-y-1">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between p-4 bg-card-bg rounded-lg border transition-all ${
                    dragIndex === index
                      ? "opacity-40 border-border"
                      : dragOverIndex === index
                        ? "border-foreground/50 ring-1 ring-foreground/20"
                        : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 cursor-grab active:cursor-grabbing text-muted hover:text-foreground transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{project.title}</p>
                      <p className="text-sm text-muted">
                        {project.year} · {project.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0 ml-4">
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-3 py-1.5 text-sm border border-border rounded hover:bg-border transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-3 py-1.5 text-sm border border-red-800 text-red-400 rounded hover:bg-red-900/30 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-muted text-center py-8">
                  등록된 프로젝트가 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "resume" && <ResumeAdmin />}
      {tab === "resume-import" && <ResumeImport />}
    </div>
  );
}

// --- Resume Admin ---
interface ResumeItem {
  id: number;
  section: string;
  title: string;
  subtitle: string | null;
  period: string | null;
  details: string | null;
  order: number;
}

const emptyResumeForm = {
  section: "experience",
  title: "",
  subtitle: "",
  period: "",
  details: "",
  order: "0",
};

function ResumeAdmin() {
  const [items, setItems] = useState<ResumeItem[]>([]);
  const [form, setForm] = useState(emptyResumeForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/resume");
      if (res.ok) setItems(await res.json());
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/resume/${editingId}` : "/api/resume";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm(emptyResumeForm);
      setEditingId(null);
      fetchItems();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("삭제하시겠습니까?")) return;
    const res = await fetch(`/api/resume/${id}`, { method: "DELETE" });
    if (res.ok) fetchItems();
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-card-bg border border-border rounded-lg text-foreground focus:outline-none focus:border-foreground/50 transition-colors";
  const labelClass = "block text-sm text-muted mb-1.5";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <h2 className="text-xl font-semibold mb-6">
          {editingId ? "이력 수정" : "이력 추가"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>섹션</label>
            <select
              value={form.section}
              onChange={(e) =>
                setForm({ ...form, section: e.target.value })
              }
              className={inputClass}
            >
              <option value="experience">Experience</option>
              <option value="education">Education</option>
              <option value="skills">Skills</option>
              <option value="awards">Awards</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>제목 *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>부제 (회사/학교명 등)</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) =>
                setForm({ ...form, subtitle: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>기간</label>
            <input
              type="text"
              value={form.period}
              onChange={(e) =>
                setForm({ ...form, period: e.target.value })
              }
              placeholder="e.g. 2020 - 2024"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>상세 내용</label>
            <textarea
              value={form.details}
              onChange={(e) =>
                setForm({ ...form, details: e.target.value })
              }
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>정렬 순서</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-white text-black rounded-lg font-medium hover:bg-accent transition-colors"
            >
              {editingId ? "수정" : "추가"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyResumeForm);
                }}
                className="px-6 py-2.5 border border-border rounded-lg text-muted hover:text-foreground transition-colors"
              >
                취소
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-6">
          등록된 이력 ({items.length})
        </h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-card-bg rounded-lg border border-border"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{item.title}</p>
                <p className="text-sm text-muted">
                  {item.section}
                  {item.period ? ` · ${item.period}` : ""}
                </p>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <button
                  onClick={() => {
                    setEditingId(item.id);
                    setForm({
                      section: item.section,
                      title: item.title,
                      subtitle: item.subtitle || "",
                      period: item.period || "",
                      details: item.details || "",
                      order: item.order.toString(),
                    });
                  }}
                  className="px-3 py-1.5 text-sm border border-border rounded hover:bg-border transition-colors"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 text-sm border border-red-800 text-red-400 rounded hover:bg-red-900/30 transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-muted text-center py-8">
              등록된 이력이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// --- LinkedIn PDF Import ---
interface ParsedItem {
  section: string;
  title: string;
  subtitle: string | null;
  period: string | null;
  details: string | null;
  order: number;
}

function ResumeImport() {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState<ParsedItem[]>([]);
  const [applied, setApplied] = useState(false);

  const sectionLabels: Record<string, string> = {
    experience: "Experience",
    education: "Education",
    skills: "Skills",
  };

  const extractTextFromPDF = async (pdfFile: File): Promise<string> => {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages: string[] = [];

    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const text = content.items.map((item: any) => item.str || "").join("\n");
      pages.push(text);
    }

    return pages.join("\n");
  };

  const handleParse = async () => {
    if (!file) return;
    setParsing(true);
    setParsed([]);
    setApplied(false);

    try {
      const text = await extractTextFromPDF(file);
      const res = await fetch("/api/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = await res.json();
        setParsed(data.items);
      } else {
        alert("PDF 파싱에 실패했습니다.");
      }
    } catch (e) {
      console.error(e);
      alert("오류가 발생했습니다.");
    }
    setParsing(false);
  };

  const handleApply = async () => {
    // Save each parsed item to the resume API
    for (const item of parsed) {
      await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    }
    setApplied(true);
  };

  const removeItem = (index: number) => {
    setParsed((prev) => prev.filter((_, i) => i !== index));
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-card-bg border border-border rounded-lg text-foreground focus:outline-none focus:border-foreground/50 transition-colors";

  return (
    <div className="space-y-8">
      {/* Upload */}
      <div className="max-w-xl">
        <h2 className="text-xl font-semibold mb-2">LinkedIn PDF Import</h2>
        <p className="text-sm text-muted mb-6">
          LinkedIn 프로필에서 PDF를 다운로드하여 업로드하면 이력서 데이터를 자동으로 파싱합니다.
        </p>
        <p className="text-xs text-muted/60 mb-6">
          LinkedIn &rarr; 내 프로필 &rarr; &quot;More&quot; 버튼 &rarr; &quot;Save to PDF&quot;
        </p>

        <div className="flex items-center gap-4">
          <label className="flex-1 relative">
            <div className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${file ? "border-foreground/30 bg-card-bg" : "border-border hover:border-foreground/20"}`}>
              <svg className="w-5 h-5 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" />
              </svg>
              <span className="text-sm text-muted truncate">
                {file ? file.name : "LinkedIn PDF를 선택하세요"}
              </span>
            </div>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setParsed([]);
                setApplied(false);
              }}
            />
          </label>
          <button
            onClick={handleParse}
            disabled={!file || parsing}
            className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            {parsing ? "분석 중..." : "분석하기"}
          </button>
        </div>
      </div>

      {/* Preview */}
      {parsed.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              파싱 결과 미리보기 <span className="text-sm font-normal text-muted">({parsed.length}개 항목)</span>
            </h2>
            {!applied ? (
              <button
                onClick={handleApply}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-500 transition-colors"
              >
                Resume에 적용하기
              </button>
            ) : (
              <span className="text-sm text-green-400">적용 완료! /resume 에서 확인하세요</span>
            )}
          </div>

          {["experience", "education", "skills"].map((section) => {
            const sectionItems = parsed.filter((item) => item.section === section);
            if (sectionItems.length === 0) return null;
            return (
              <div key={section} className="mb-8">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted mb-4 border-b border-border pb-2">
                  {sectionLabels[section] || section}
                </h3>
                <div className="space-y-3">
                  {sectionItems.map((item, idx) => {
                    const globalIdx = parsed.indexOf(item);
                    return (
                      <div key={idx} className="flex items-start gap-4 p-4 bg-card-bg rounded-lg border border-border group">
                        {item.period && (
                          <div className="w-36 shrink-0 text-sm text-muted pt-0.5">
                            {item.period}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{item.title}</p>
                          {item.subtitle && <p className="text-sm text-muted mt-0.5">{item.subtitle}</p>}
                          {item.details && (
                            <p className="text-sm text-foreground/60 mt-2 whitespace-pre-line">{item.details}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(globalIdx)}
                          className="shrink-0 p-1.5 text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                          title="제거"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
