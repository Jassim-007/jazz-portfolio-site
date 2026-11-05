-- Run only in the PORTFOLIO project (project ref: mltiunpjhpwlgibcvfym).
-- Update the 56 gallery records using their original Storage filenames.
-- The repeated sunset/boat frame is unpublished, not deleted from Storage.
BEGIN;

UPDATE public.portfolio_media AS media
SET title = caption_data.title,
    description = caption_data.description,
    alt_text = caption_data.alt_text,
    sort_order = caption_data.sort_order,
    is_published = NOT caption_data.is_duplicate
FROM (VALUES
  ('WhatsApp Image 2026-11-05 at 3.45.22 AM.jpeg', 'Into the Fog', 'A narrow trail disappears into a mist-covered hillside.', 'A narrow trail through a foggy green hillside.', 1, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.24 AM.jpeg', 'Hills in Haze', 'Layers of green fade into the morning mist.', 'Green hills fading into morning mist.', 2, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.25 AM (1).jpeg', 'Pastel Evening', 'Soft pink clouds drift across a blue-hour sky.', 'Pink and blue clouds at dusk.', 3, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.25 AM.jpeg', 'Dome at Dusk', 'The sun slips behind the carved dome.', 'An ornate mosque dome against a warm sunset.', 4, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.26 AM.jpeg', 'Last Light on the Water', 'A small boat crosses the orange horizon.', 'A boat and shoreline silhouetted at sunset.', 5, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.27 AM.jpeg', 'Wave After Wave', 'The last light catches the breaking shore.', 'Sunset light over waves and shoreline.', 6, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.28 AM (1).jpeg', 'Fishing Boat at Sunset', 'A boat passes between the glowing sun and the breakwater.', 'A fishing boat passes a rocky breakwater at sunset.', 7, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.28 AM (2).jpeg', 'Fishing Boat at Sunset', 'A boat passes between the glowing sun and the breakwater.', 'Duplicate frame of a fishing boat at sunset.', 8, TRUE),
  ('WhatsApp Image 2026-11-05 at 3.45.28 AM.jpeg', 'Sunset Tide', 'A warm sun lowers over the rolling surf.', 'The sun setting over the ocean surf.', 9, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.29 AM.jpeg', 'Silver Crossing', 'A fishing boat cuts through a bright, open sea.', 'A fishing boat crossing a silver sea.', 10, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.30 AM (1).jpeg', 'Red in the Streets', 'A car moves through a cloud of red celebration smoke.', 'A car among red smoke in a crowded street.', 11, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.30 AM.jpeg', 'Across the Water', 'A long narrow boat carries its crew across still water.', 'People aboard a long boat on calm water.', 12, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.31 AM.jpeg', 'Blue and White', 'Fans lift their flags beneath a portrait of Messi.', 'Football supporters with flags and a Messi portrait.', 13, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.32 AM (1).jpeg', 'A Flag Above the Crowd', 'Supporters gather beneath an Argentina flag.', 'A crowd gathered beneath an Argentina flag.', 14, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.32 AM.jpeg', 'One More Song', 'The crowd cheers as scarves and flags rise through the haze.', 'Football supporters cheering with flags in the air.', 15, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.34 AM (1).jpeg', 'Rally Day', 'Spectators gather beside bright rally cars.', 'A motorsport crowd beside rally cars.', 16, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.34 AM.jpeg', 'Brazil in the Street', 'A Brazil flag rises above a crowd of supporters.', 'A Brazil flag above a crowd of supporters.', 17, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.35 AM.jpeg', 'Cloudline', 'Low cloud curls over a smooth green ridge.', 'Low clouds over a green mountain ridge.', 18, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.36 AM.jpeg', 'Rain over the Valley', 'Heavy clouds settle above the layered green hills.', 'Clouds over a layered green valley.', 19, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.37 AM.jpeg', 'Over the Ridge', 'A wall of cloud spills across the mountaintop.', 'A bank of cloud flowing across a green ridge.', 20, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.38 AM (1).jpeg', 'Among the Clouds', 'Mist opens a brief view of the green hillside.', 'A green hillside seen through passing mist.', 21, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.38 AM (2).jpeg', 'A Valley in White', 'Cloud fills the space between two steep ridges.', 'Fog between two green mountain ridges.', 22, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.38 AM.jpeg', 'The Hills Below', 'Green slopes fall into a fog-softened valley.', 'Green slopes descending into a misty valley.', 23, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.40 AM.jpeg', 'Mist Along the Summit', 'Cloud moves across the curve of the hillside.', 'Mist drifting across a rounded green summit.', 24, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.41 AM.jpeg', 'A Passing Cloud', 'Fog drifts low over the green mountain folds.', 'Low fog drifting over green mountain folds.', 25, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.42 AM.jpeg', 'Where the Ridge Ends', 'The ridge fades into a bank of white cloud.', 'A green ridge fading into white cloud.', 26, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.43 AM (1).jpeg', 'After the Rain', 'A rainbow appears above the palms.', 'A rainbow above palm trees after rain.', 27, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.43 AM (2).jpeg', 'Resting at the Quarry', 'A dark 4x4 sits beneath an old concrete lookout.', 'A dark four-wheel-drive vehicle at a rocky site.', 28, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.43 AM.jpeg', 'Cloud Study', 'A bright cloud towers into the blue.', 'A towering white cloud against a blue sky.', 29, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.44 AM.jpeg', 'Open Country', 'A white 4x4 stands among dry grass and pale earth.', 'A white vehicle on open scrubland.', 30, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.46 AM.jpeg', 'Temple After Dark', 'Headlights glow beneath the illuminated temple tower.', 'A vehicle beneath an illuminated temple at night.', 31, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.47 AM (1).jpeg', 'Yellow in the Garden', 'An old yellow car rests behind a veil of flowers.', 'A close view of a yellow vintage car among flowers.', 32, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.47 AM.jpeg', 'Sunset in the Mirror', 'The setting sun finds a frame in the side mirror.', 'A sunset reflected in a car side mirror.', 33, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.48 AM.jpeg', 'The Old Yellow Car', 'Warm light falls across the car and its quiet house.', 'A yellow vintage car parked by a house.', 34, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.49 AM (1).jpeg', 'Field Notes', 'A solitary bird stands in a wide green field.', 'A small bird in a green field.', 35, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.49 AM.jpeg', 'An Afternoon''s Work', 'A gardener cuts the lawn beneath the palms.', 'A person mowing a lawn beneath palm trees.', 36, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.50 AM.jpeg', 'Last Color in the Sky', 'A narrow tower meets the orange edge of dusk.', 'A slender tower against an orange sunset.', 37, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.52 AM (1).jpeg', 'A Pause Above', 'A small bird perches against an open sky.', 'A bird perched on a pole against the sky.', 38, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.52 AM (2).jpeg', 'Haze over the Hills', 'Homes and fields soften in the distant mist.', 'A hazy valley with homes and fields.', 39, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.52 AM.jpeg', 'Little Lookout', 'A kitten pauses in a patch of warm light.', 'A kitten looking toward the camera.', 40, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.53 AM (1).jpeg', 'Green after Rain', 'A bright hillside opens beneath a clearing sky.', 'Bright green hills beneath a pale sky.', 41, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.53 AM (2).jpeg', 'Homes in the Hills', 'A few houses sit among the misty green slopes.', 'Houses scattered over misty green hills.', 42, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.53 AM.jpeg', 'Red Blossom', 'A flowering tree adds a warm note to the green valley.', 'A red-blossomed tree in a green landscape.', 43, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.57 AM (1).jpeg', 'Patchwork Below', 'Fields and roads form a quiet pattern across the valley.', 'Fields and roads seen from above.', 44, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.57 AM (2).jpeg', 'From the Hillside', 'A high view looks across farms and a distant settlement.', 'A high view across green farms and a settlement.', 45, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.57 AM.jpeg', 'Roadside Pause', 'A white car waits beneath a tunnel of trees.', 'A white car beneath a shaded tree canopy.', 46, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.58 AM.jpeg', 'Valley from Above', 'The town spreads beneath a wide blue mountain horizon.', 'A town and valley below blue mountains.', 47, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.59 AM (1).jpeg', 'Still Water at Sundown', 'The last light doubles in the still water.', 'Sunset reflected on water beside dark vegetation.', 48, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.45.59 AM.jpeg', 'Beyond the Valley', 'Clouds gather above a blue line of mountains.', 'Blue mountains beneath a cloudy sky.', 49, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.46.00 AM (1).jpeg', 'Sun behind the Storm', 'A muted sun glows through a dark bank of cloud.', 'A dim sun behind dark clouds over water.', 50, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.46.00 AM.jpeg', 'Dome after Sunset', 'The mosque rises softly against a fading sky.', 'A mosque dome silhouetted against twilight.', 51, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.46.03 AM (1).jpeg', 'Between the Banks', 'Boats move across the broad river beneath a grey sky.', 'Boats on a wide river beneath an overcast sky.', 52, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.46.03 AM.jpeg', 'Field Visitor', 'A bird stands along the garden wall.', 'A bird standing near a garden wall.', 53, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.46.04 AM (1).jpeg', 'A Roadside Hand', 'Two men pause beside a vehicle on the roadside.', 'Two people beside a vehicle on a rural road.', 54, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.46.04 AM (2).jpeg', 'Under the Branches', 'A bird rests in the shade of a tree.', 'A bird perched among tree branches.', 55, FALSE),
  ('WhatsApp Image 2026-11-05 at 3.46.04 AM.jpeg', 'Small Against the Sky', 'A bird crosses a field of passing clouds.', 'A small bird flying against a cloudy sky.', 56, FALSE)
) AS caption_data(storage_path, title, description, alt_text, sort_order, is_duplicate)
WHERE media.kind = 'photo'
  AND media.storage_path = caption_data.storage_path;

COMMIT;

-- Confirm the result: expect 55 published photos and 1 hidden duplicate.
SELECT
  count(*) FILTER (WHERE is_published) AS published_photos,
  count(*) FILTER (WHERE NOT is_published) AS hidden_photos
FROM public.portfolio_media
WHERE kind = 'photo';
