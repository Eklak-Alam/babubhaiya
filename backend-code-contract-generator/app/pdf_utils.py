from reportlab.lib.pagesizes import LETTER
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import os

def save_contract_pdf(text: str, filename: str = "contract.pdf") -> str:
    # Ensure the contracts folder exists
    os.makedirs("contracts", exist_ok=True)

    # Always save inside "contracts" folder
    path = os.path.join("contracts", filename)

    # Create custom styles without bold
    styles = getSampleStyleSheet()
    normal_style = ParagraphStyle(
        'NormalNoBold',
        parent=styles['Normal'],
        fontName='Times-Roman',  # Regular font
        fontSize=12,
        leading=14
    )

    # Create the PDF
    doc = SimpleDocTemplate(
        path, pagesize=LETTER,
        rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=72
    )

    flowables = []
    for paragraph in text.strip().split("\n\n"):
        # Strip markdown-like characters
        clean_text = paragraph.replace("**", "").replace("__", "").replace("*", "")
        para = Paragraph(clean_text.replace("\n", "<br />"), normal_style)
        flowables.append(para)
        flowables.append(Spacer(1, 0.2 * inch))

    doc.build(flowables)
    return path
