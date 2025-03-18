#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Markdown Table to JSON Converter
--------------------------------
This script converts the Markdown table in channels.md to a JSON file (channels.json).
It can be run manually to update the channels.json file locally.

Usage:
    python md-to-json.py
"""

import re
import json
from pathlib import Path

def md_table_to_json(md_file, json_file):
    """Convert a Markdown table to JSON format"""
    print(f"Reading from {md_file}...")
    
    # Read Markdown file
    md_content = Path(md_file).read_text(encoding='utf-8')
    
    # Split the file into lines
    lines = md_content.strip().split('\n')
    
    # Find the table in the Markdown file
    table_lines = []
    in_table = False
    header_line = None
    separator_line = None
    
    for line in lines:
        line = line.strip()
        if line.startswith('|') and line.endswith('|'):
            if not in_table:
                in_table = True
                header_line = line
            elif header_line and not separator_line and '---' in line:
                separator_line = line
            elif header_line and separator_line:
                table_lines.append(line)
    
    if not header_line or not separator_line:
        print("❌ Error: No valid table found in the Markdown file.")
        return False
    
    # Extract header fields
    header_fields = [field.strip() for field in header_line.split('|')[1:-1]]
    
    if len(header_fields) != 5:
        print(f"❌ Error: Expected 5 columns in table header, found {len(header_fields)}.")
        return False
    
    # Process each row
    channels = []
    for row_line in table_lines:
        fields = [field.strip() for field in row_line.split('|')[1:-1]]
        
        if len(fields) != 5:
            print(f"⚠️ Warning: Skipping row with {len(fields)} fields instead of 5: {row_line}")
            continue
        
        channel_name = fields[0]
        
        # Extract link - handle markdown link format [text](url)
        link_cell = fields[1]
        link_match = re.search(r'\[(.*?)\]\((.*?)\)', link_cell)
        if link_match:
            link = link_match.group(2)
        else:
            link = link_cell
        
        status = fields[2]
        
        # Extract tags
        tags_cell = fields[3]
        tags = [tag.strip() for tag in tags_cell.split(',')] if tags_cell else []
        
        description = fields[4]
        
        # Create channel object
        channel = {
            "name": channel_name,
            "link": link,
            "status": status,
            "tags": tags,
            "description": description
        }
        
        channels.append(channel)
    
    # Write to json file
    print(f"Writing to {json_file}...")
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(channels, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Successfully converted {md_file} to {json_file}")
    print(f"📊 Processed {len(channels)} channels")
    return True

if __name__ == "__main__":
    # Get the directory where the script is located
    script_dir = Path(__file__).parent.parent
    
    # Define paths relative to the script directory
    md_file = script_dir / 'data' / 'channels.md'
    json_file = script_dir / 'data' / 'channels.json'
    
    print("🔄 Converting Markdown table to JSON...")
    
    if md_table_to_json(md_file, json_file):
        print("✨ Conversion completed successfully!")
    else:
        print("❌ Conversion failed.") 