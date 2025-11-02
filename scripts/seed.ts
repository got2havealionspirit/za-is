import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const url = process.env.SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE;

if (!url || !serviceRole) {
  throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE before running the seed script");
}

const supabase = createClient(url, serviceRole);

async function main() {
  const profiles = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      handle: "demo-chef",
      avatar_url: null,
      bio: "Inventor of the steampunk souffle."
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      handle: "iron-baker",
      avatar_url: null,
      bio: "Bakes with gears and love."
    }
  ];

  for (const profile of profiles) {
    await supabase.from("profiles").upsert(profile, { onConflict: "id" });
  }

  const videos = [
    {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      user_id: profiles[0].id,
      title: "Copper Crust Crostini",
      tags: ["toasts", "snack"],
      recipe: {
        ingredients: [
          { name: "Baguette", qty: "1" },
          { name: "Copper glaze", qty: "50ml" }
        ],
        steps: [
          { t: 0, text: "Slice the baguette" },
          { t: 15, text: "Brush with glaze" }
        ]
      },
      storage_path: "public/samples/sample-one.mp4",
      thumb_url: null
    },
    {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      user_id: profiles[1].id,
      title: "Gear Grinder Gnocchi",
      tags: ["pasta", "dinner"],
      recipe: {
        ingredients: [
          { name: "Potato", qty: "2" },
          { name: "Bronze butter", qty: "30g" }
        ],
        steps: [
          { t: 0, text: "Mash potatoes" },
          { t: 20, text: "Fold in flour" }
        ]
      },
      storage_path: "public/samples/sample-two.mp4",
      thumb_url: null
    }
  ];

  for (const video of videos) {
    await supabase.from("videos").upsert(video, { onConflict: "id" });
  }

  console.log("Seed complete");
}

void main();
