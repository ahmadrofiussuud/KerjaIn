import os
import numpy as np
from PIL import Image, ImageChops, ImageFilter

def generate_parallax_frames():
    input_path = "public/hero baru.png"
    output_dir = "public/frames"
    os.makedirs(output_dir, exist_ok=True)

    # Load original image
    base_img = Image.open(input_path).convert("RGBA")
    W, H = base_img.size

    # 1. Create a feathered mask for the left and right pillars (foreground)
    # Left pillar width: ~280px, Right pillar width: ~280px
    mask = np.zeros((H, W), dtype=np.uint8)
    
    # Left pillar mask (0 to 320px with feathering from 220px to 320px)
    for x in range(W):
        if x < 220:
            mask[:, x] = 255
        elif x < 320:
            # Linear fade out
            mask[:, x] = int(255 * (1.0 - (x - 220) / 100.0))
            
    # Right pillar mask (W-320px to W with feathering from W-320px to W-220px)
    for x in range(W):
        rx = W - 1 - x
        if rx < 220:
            mask[:, x] = 255
        elif rx < 320:
            mask[:, x] = int(255 * (1.0 - (rx - 220) / 100.0))

    # Convert mask to PIL Image and blur it slightly for smoother edges
    mask_img = Image.fromarray(mask, mode="L").filter(ImageFilter.GaussianBlur(5))

    # Extract foreground (pillars) using the mask
    fg_img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    fg_img.paste(base_img, (0, 0), mask_img)

    # 2. Background image is the base image
    bg_img = base_img.copy()

    num_frames = 100
    print(f"Generating {num_frames} frames in {output_dir}...")

    for i in range(num_frames):
        t = i / (num_frames - 1)  # 0.0 to 1.0

        # Background Zoom (dolly-in): 0% to 8% scale increase
        bg_scale = 1.0 + (t * 0.08)
        bg_w_new = int(W * bg_scale)
        bg_h_new = int(H * bg_scale)
        bg_resized = bg_img.resize((bg_w_new, bg_h_new), Image.Resampling.LANCZOS)
        
        # Crop background back to WxH centered
        bg_x = (bg_w_new - W) // 2
        bg_y = (bg_h_new - H) // 2
        bg_frame = bg_resized.crop((bg_x, bg_y, bg_x + W, bg_y + H))

        # Create canvas for final frame merging
        frame = Image.new("RGBA", (W, H))
        frame.paste(bg_frame, (0, 0))

        # Foreground translation (slide outward) and scale (dolly-in):
        # Foreground scales faster than background (e.g. 0% to 25% scale increase)
        fg_scale = 1.0 + (t * 0.25)
        fg_w_new = int(W * fg_scale)
        fg_h_new = int(H * fg_scale)
        fg_resized = fg_img.resize((fg_w_new, fg_h_new), Image.Resampling.LANCZOS)

        # Base offsets for center
        fg_crop_x = (fg_w_new - W) // 2
        fg_crop_y = (fg_w_new - H) // 2 # Wait, height scale is based on H, so:
        fg_crop_y = (fg_h_new - H) // 2

        # Slide left pillar left and right pillar right
        # We can crop the left and right halves of fg_resized separately and paste them
        half_w = W // 2
        fg_half_w_new = fg_w_new // 2

        # Left Half Foreground
        left_fg = fg_resized.crop((0, fg_crop_y, half_w, fg_crop_y + H))
        # Slide left: shift_x goes left up to 260px
        slide_left_x = -int(t * 260)
        frame.paste(left_fg, (slide_left_x, 0), left_fg)

        # Right Half Foreground
        right_fg = fg_resized.crop((fg_w_new - half_w, fg_crop_y, fg_w_new, fg_crop_y + H))
        # Slide right: shift_x goes right up to 260px
        slide_right_x = half_w + int(t * 260)
        frame.paste(right_fg, (slide_right_x, 0), right_fg)

        # Save frame as JPEG
        frame_converted = frame.convert("RGB")
        frame_name = f"ezgif-frame-{String(i + 1).zfill(3)}.jpg" if False else f"ezgif-frame-{str(i + 1).zfill(3)}.jpg"
        frame_converted.save(os.path.join(output_dir, frame_name), "JPEG", quality=90)

    print("Success! Generated all 100 frames.")

if __name__ == "__main__":
    generate_parallax_frames()
