ALTER TABLE "menu_items" ADD COLUMN "food_tag" text;--> statement-breakpoint
ALTER TABLE "restaurants" DROP COLUMN "tagline";--> statement-breakpoint
ALTER TABLE "restaurants" DROP COLUMN "food_tags";