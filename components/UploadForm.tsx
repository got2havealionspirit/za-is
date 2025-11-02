"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { uploadSchema, recipeSchema } from "@/lib/validators";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const defaultRecipe = {
  ingredients: [
    { name: "Tomato", qty: "2" },
    { name: "Olive oil", qty: "2 tbsp" }
  ],
  steps: [
    { t: 0, text: "Prep your veggies" },
    { t: 10, text: "Sear until aromatic" }
  ]
};

type UploadValues = z.infer<typeof uploadSchema> & { file?: File | null };

export default function UploadForm() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UploadValues>({
    resolver: zodResolver(uploadSchema.extend({ file: z.instanceof(File).optional() })),
    defaultValues: {
      title: "",
      tags: [],
      recipe: defaultRecipe,
      fileName: "",
      thumbUrl: ""
    }
  });

  const onSubmit = async (values: UploadValues) => {
    if (!values.file) {
      setError("Attach a video file first");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const session = await supabaseClient.auth.getSession();
      if (!session.data.session) {
        setError("Please sign in first");
        setUploading(false);
        return;
      }

      const { data: storage, error: storageError } = await supabaseClient.storage
        .from("videos")
        .upload(`temp/${crypto.randomUUID()}-${values.file.name}`, values.file, {
          cacheControl: "3600",
          upsert: false
        });

      if (!storage || storageError) {
        throw storageError ?? new Error("Upload failed");
      }

      const { error: insertError } = await supabaseClient.from("videos").insert({
        user_id: session.data.session.user.id,
        title: values.title,
        tags: values.tags,
        recipe: recipeSchema.parse(values.recipe),
        storage_path: storage.path,
        thumb_url: values.thumbUrl || null
      });

      if (insertError) throw insertError;

      router.push("/feed");
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-copper-500/30 bg-black/50 p-8 shadow-glow">
      <div>
        <label className="text-sm uppercase tracking-[0.3em]">Title</label>
        <input
          className="mt-2 w-full rounded-xl border border-copper-500/30 bg-black/60 p-3"
          {...form.register("title")}
        />
      </div>
      <div>
        <label className="text-sm uppercase tracking-[0.3em]">Tags (comma separated)</label>
        <input
          className="mt-2 w-full rounded-xl border border-copper-500/30 bg-black/60 p-3"
          onBlur={(event) => {
            const tags = event.target.value
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean);
            form.setValue("tags", tags);
          }}
        />
      </div>
      <div>
        <label className="text-sm uppercase tracking-[0.3em]">Recipe JSON</label>
        <textarea
          className="mt-2 h-40 w-full rounded-xl border border-copper-500/30 bg-black/60 p-3 font-mono text-xs"
          defaultValue={JSON.stringify(defaultRecipe, null, 2)}
          onBlur={(event) => {
            try {
              const parsed = JSON.parse(event.target.value);
              form.setValue("recipe", recipeSchema.parse(parsed));
            } catch (err) {
              setError("Invalid recipe JSON");
            }
          }}
        />
      </div>
      <div>
        <label className="text-sm uppercase tracking-[0.3em]">Video file</label>
        <input
          type="file"
          accept="video/mp4,video/webm"
          className="mt-2 w-full cursor-pointer rounded-xl border border-dashed border-copper-500/30 bg-black/40 p-10 text-center"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              form.setValue("file", file);
              form.setValue("fileName", file.name);
            }
          }}
        />
      </div>
      <div>
        <label className="text-sm uppercase tracking-[0.3em]">Thumbnail URL</label>
        <input
          className="mt-2 w-full rounded-xl border border-copper-500/30 bg-black/60 p-3"
          {...form.register("thumbUrl")}
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={uploading}
        className="w-full rounded-full bg-copper-500 px-6 py-3 text-lg font-semibold text-background shadow-glow disabled:opacity-60"
      >
        {uploading ? "Uploading..." : "Launch"}
      </button>
    </form>
  );
}
