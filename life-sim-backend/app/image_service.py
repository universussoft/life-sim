import base64
import io
from PIL import Image, ImageDraw, ImageFont
import random

class ImageService:
    def __init__(self):
        pass
    
    def generate_placeholder_image(self, prompt: str, entity_type: str) -> str:
        width, height = 512, 512
        
        colors = [
            (138, 43, 226),
            (75, 0, 130),
            (72, 61, 139),
            (106, 90, 205),
            (123, 104, 238),
            (147, 112, 219),
            (139, 69, 19),
            (160, 82, 45),
            (205, 133, 63)
        ]
        
        bg_color = random.choice(colors)
        
        img = Image.new('RGB', (width, height), color=bg_color)
        draw = ImageDraw.Draw(img)
        
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
            small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
        except:
            font = ImageFont.load_default()
            small_font = ImageFont.load_default()
        
        text = entity_type.upper()
        
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        text_x = (width - text_width) // 2
        text_y = (height - text_height) // 2 - 40
        
        draw.text((text_x, text_y), text, fill=(255, 255, 255), font=font)
        
        prompt_lines = []
        words = prompt.split()
        current_line = []
        for word in words:
            current_line.append(word)
            test_line = ' '.join(current_line)
            bbox = draw.textbbox((0, 0), test_line, font=small_font)
            if bbox[2] - bbox[0] > width - 40:
                current_line.pop()
                if current_line:
                    prompt_lines.append(' '.join(current_line))
                current_line = [word]
        if current_line:
            prompt_lines.append(' '.join(current_line))
        
        prompt_lines = prompt_lines[:3]
        
        y_offset = text_y + text_height + 30
        for line in prompt_lines:
            bbox = draw.textbbox((0, 0), line, font=small_font)
            line_width = bbox[2] - bbox[0]
            line_x = (width - line_width) // 2
            draw.text((line_x, y_offset), line, fill=(220, 220, 220), font=small_font)
            y_offset += 25
        
        border_width = 5
        draw.rectangle(
            [(0, 0), (width-1, height-1)],
            outline=(255, 255, 255),
            width=border_width
        )
        
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return f"data:image/png;base64,{img_str}"

image_service = ImageService()
