from pathlib import Path
import textwrap

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'site' / 'recursos' / 'checklist-boda.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)

PAGE_W, PAGE_H = 595, 842
MARGIN = 42

sections = [
    ('12–18 meses antes', ['Definir presupuesto y prioridades', 'Elegir fecha o rango de fechas', 'Crear lista aproximada de invitados', 'Visitar y reservar el espacio', 'Valorar ayuda de planificación', 'Investigar documentación de la ceremonia']),
    ('9–12 meses antes', ['Reservar fotografía y vídeo', 'Elegir música y entretenimiento', 'Definir catering y necesidades especiales', 'Empezar a buscar vestuario', 'Pensar alojamiento y transporte', 'Crear concepto visual y paleta']),
    ('6–3 meses antes', ['Enviar invitaciones', 'Cerrar flores, mobiliario e iluminación', 'Definir menú y bebidas', 'Preparar ceremonia, lecturas y música', 'Organizar alojamiento y traslados', 'Revisar contratos y próximos pagos']),
    ('Últimas 8 semanas', ['Confirmar número final de invitados', 'Crear seating plan', 'Compartir timing con proveedores', 'Preparar contactos y plan B', 'Delegar la coordinación del día', 'Preparar pagos, sobres y detalles']),
    ('La semana de la boda', ['Confirmar llegadas y montajes', 'Entregar alianzas y elementos importantes', 'Dejar documentos y teléfonos a la coordinación', 'Dormir, respirar y disfrutar', 'Recordar que no todo tiene que ser perfecto para ser vuestro']),
]

# The PDF uses the built-in Helvetica family with WinAnsiEncoding, so it has no
# third-party build dependency and still supports the Spanish characters used here.
def esc_pdf(value: str) -> bytes:
    return value.encode('cp1252', errors='replace').replace(b'\\', b'\\\\').replace(b'(', b'\\(').replace(b')', b'\\)')


def add_text(stream: bytearray, x: float, y: float, value: str, size: int = 10, bold: bool = False, color=(0.18, 0.15, 0.16)):
    font = b'/F2' if bold else b'/F1'
    stream.extend(f'{color[0]} {color[1]} {color[2]} rg BT '.encode('ascii'))
    stream.extend(font + f' {size} Tf {x} {y} Td ('.encode('ascii') + esc_pdf(value) + b') Tj ET\n')


def add_wrapped(stream: bytearray, x: float, y: float, value: str, width: int, size: int = 10, line_height: int = 15, bold: bool = False, color=(0.32, 0.29, 0.29)):
    lines = []
    for paragraph in value.split('\n'):
        lines.extend(textwrap.wrap(paragraph, width=width, break_long_words=False, break_on_hyphens=False) or [''])
    for line in lines:
        add_text(stream, x, y, line, size=size, bold=bold, color=color)
        y -= line_height
    return y


def page_stream(page_number: int, content_sections):
    stream = bytearray()
    # Rose top band.
    stream.extend(b'0.66 0.33 0.36 rg 0 800 595 42 re f\n')
    add_text(stream, 42, 815, 'GOWEDDINGPLANNER · RECURSO GRATUITO', size=9, bold=True, color=(1, 1, 1))
    y = 770
    if page_number == 1:
        add_text(stream, 42, y, 'La boda,', size=29, bold=True, color=(0.18, 0.15, 0.16)); y -= 34
        add_text(stream, 42, y, 'paso a paso.', size=29, bold=True, color=(0.66, 0.33, 0.36)); y -= 30
        y = add_wrapped(stream, 42, y, 'Una lista sencilla para saber qué toca ahora, qué puede esperar y qué conviene delegar. Adaptadla a vuestro ritmo: organizar bien también es una forma de disfrutar.', 80, size=10, line_height=15)
        y -= 14
    else:
        add_text(stream, 42, y, 'Checklist de boda', size=24, bold=True); y -= 32
        y = add_wrapped(stream, 42, y, 'Continuación · decisiones pequeñas, celebraciones grandes.', 80, size=10, line_height=15)
        y -= 12

    for heading, items in content_sections:
        if y < 150:
            break
        stream.extend(b'0.84 0.76 0.74 RG 42 ' + str(int(y + 7)).encode('ascii') + b' m 553 ' + str(int(y + 7)).encode('ascii') + b' l S\n')
        y -= 18
        add_text(stream, 42, y, heading, size=15, bold=True, color=(0.18, 0.15, 0.16)); y -= 22
        for item in items:
            if y < 72:
                break
            stream.extend(b'0.66 0.33 0.36 RG 44 ' + str(int(y + 2)).encode('ascii') + b' 7 7 re S\n')
            y = add_wrapped(stream, 60, y, item, 70, size=10, line_height=14, color=(0.32, 0.29, 0.29)) - 3
        y -= 7

    if page_number == 2:
        stream.extend(b'0.84 0.76 0.74 RG 42 104 m 553 104 l S\n')
        add_text(stream, 42, 84, 'Una nota para vosotros', size=13, bold=True, color=(0.66, 0.33, 0.36))
        add_wrapped(stream, 42, 66, 'La mejor organización es la que os devuelve tiempo para estar juntos. Si queréis ayuda para ordenar el proyecto, escribidnos en hola@goweddingplanner.com.', 80, size=9, line_height=13)
    add_text(stream, 194, 27, f'goweddingplanner.com · página {page_number}', size=8, color=(0.45, 0.42, 0.42))
    return bytes(stream)

# Keep the checklist compact and legible across two pages.
page_one = sections[:3]
page_two = sections[3:]
streams = [page_stream(1, page_one), page_stream(2, page_two)]

objects = []
objects.append(b'<< /Type /Catalog /Pages 2 0 R >>')
objects.append(b'<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>')
objects.append(b'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 7 0 R >>')
objects.append(b'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 8 0 R >>')
objects.append(b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')
objects.append(b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>')
for stream in streams:
    objects.append(b'<< /Length ' + str(len(stream)).encode('ascii') + b' >>\nstream\n' + stream + b'endstream')

pdf = bytearray(b'%PDF-1.4\n%\xe2\xe3\xcf\xd3\n')
offsets = [0]
for index, obj in enumerate(objects, start=1):
    offsets.append(len(pdf))
    pdf.extend(f'{index} 0 obj\n'.encode('ascii'))
    pdf.extend(obj)
    pdf.extend(b'\nendobj\n')
xref = len(pdf)
pdf.extend(f'xref\n0 {len(objects) + 1}\n'.encode('ascii'))
pdf.extend(b'0000000000 65535 f \n')
for offset in offsets[1:]:
    pdf.extend(f'{offset:010d} 00000 n \n'.encode('ascii'))
pdf.extend(f'trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n'.encode('ascii'))
OUT.write_bytes(pdf)
print(f'Created {OUT}')
