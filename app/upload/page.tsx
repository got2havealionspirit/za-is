import Guarded from "@/components/Guarded";
import UploadForm from "@/components/UploadForm";

export default function UploadPage() {
  return (
    <Guarded>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
        <header>
          <p className="text-sm uppercase tracking-[0.4em] text-copper-500">Upload</p>
          <h1 className="mt-2 text-4xl font-display">Drop a new culinary beat</h1>
          <p className="mt-2 text-sm text-foreground/60">
            Upload a vertical short, add your recipe JSON, and we will sync it for viewers.
          </p>
        </header>
        <UploadForm />
      </div>
    </Guarded>
  );
}
