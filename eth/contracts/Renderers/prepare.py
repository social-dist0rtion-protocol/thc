import re

def process_svg_string(svg_string):
    # Remove all new lines and squash spaces
    single_line = ' '.join(svg_string.split())

    # Split by '{}'
    parts = re.split(r'{\s*}', single_line)

    # Output each part as a string variable
    for i, part in enumerate(parts):
        # Replace double curly braces with single ones
        part = part.replace('{{', '{').replace('}}', '}').replace('"', "'")
        print(f'string constant placeholder{i} = "{part}";')

if __name__ == "__main__":
    svg_input ="""
    <svg width="600" height="600" style="background: black">

<g>
        <circle cx='300' cy='180' r='100' fill='red' />
        <circle cx='265' cy='155' r='15' fill='black' />
        <circle cx='335' cy='155' r='15' fill='black' />
        <path stroke='black' d='M 250 210 C 275 240, 325 240, 350 210' stroke-width='13' stroke-linecap='round'
            fill='transparent' />
    </g>
    </svg>
"""
    process_svg_string(svg_input)