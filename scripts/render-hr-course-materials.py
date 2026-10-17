"""Render a specimen certificate and private instructor knowledge-check pack."""
import json
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT.parent / "course-materials" / "hr-masterclass"
OUT.mkdir(parents=True, exist_ok=True)
BLUE = colors.HexColor("#0066FF")
INK = colors.HexColor("#111111")
GREY = colors.HexColor("#555555")
pdfmetrics.registerFont(TTFont("AcademySans", "C:/Windows/Fonts/arial.ttf"))
pdfmetrics.registerFont(TTFont("AcademySansBold", "C:/Windows/Fonts/arialbd.ttf"))
pdfmetrics.registerFont(TTFont("AcademySerif", "C:/Windows/Fonts/georgia.ttf"))
pdfmetrics.registerFont(TTFont("AcademySerifBold", "C:/Windows/Fonts/georgiab.ttf"))
checks = json.loads((ROOT / "scripts/content/hr-masterclass-checks.json").read_text(encoding="utf-8"))

def centered(c, text, y, font, size, colour=INK):
    c.setFillColor(colour)
    c.setFont(font, size)
    c.drawCentredString(landscape(A4)[0] / 2 + 8, y, text)

cert_path = OUT / "Solva-HR-Academy-Certificate-Specimen.pdf"
c = canvas.Canvas(str(cert_path), pagesize=landscape(A4))
c.setTitle("Solva HR Academy - Certificate Design Specimen")
c.setAuthor("Solva HR Academy")
w, h = landscape(A4)
c.setFillColor(colors.white)
c.rect(0, 0, w, h, fill=1, stroke=0)
c.setFillColor(BLUE)
c.rect(0, 0, 14, h, fill=1, stroke=0)
c.setStrokeColor(colors.HexColor("#D9DFE8"))
c.setLineWidth(0.6)
c.rect(31, 26, w - 58, h - 52, fill=0, stroke=1)
c.drawImage(str(ROOT / "public/icon-512.png"), 61, h - 88, 36, 36, mask="auto")
c.setFillColor(INK)
c.setFont("AcademySansBold", 16)
c.drawString(108, h - 66, "SOLVA HR ACADEMY")
c.setFillColor(GREY)
c.setFont("AcademySans", 8)
c.drawString(109, h - 82, "A learning academy on Solva Academy")
c.setFillColor(BLUE)
c.setFont("AcademySansBold", 8)
c.drawRightString(w - 58, h - 64, "DESIGN SPECIMEN")
c.setStrokeColor(BLUE)
c.line(62, h - 108, w - 58, h - 108)
centered(c, "CERTIFICATE OF COMPLETION", 439, "AcademySansBold", 13, BLUE)
centered(c, "This is to certify that", 405, "AcademySerif", 13, GREY)
centered(c, "LEARNER NAME", 358, "AcademySerifBold", 31)
c.setStrokeColor(colors.HexColor("#D9DFE8"))
c.line(170, 340, w - 153, 340)
centered(c, "has completed the 16-part programme in", 313, "AcademySans", 12, GREY)
centered(c, "Practical Human Resource Management", 272, "AcademySerifBold", 25)
centered(c, "HR Practice from A to Z", 243, "AcademySans", 13, GREY)
centered(c, "Employee lifecycle  |  HR operations  |  People management", 214, "AcademySans", 10, GREY)
c.setStrokeColor(INK)
c.line(76, 133, 297, 133)
c.setFont("AcademySansBold", 11)
c.setFillColor(INK)
c.drawString(76, 113, "Timothy Sila")
c.setFont("AcademySans", 9)
c.setFillColor(GREY)
c.drawString(76, 97, "Programme Facilitator | Authorized signature")
c.setFont("AcademySansBold", 9)
c.drawString(495, 130, "DATE OF ISSUE")
c.drawString(495, 94, "CERTIFICATE NUMBER")
c.setFont("AcademySans", 9)
c.drawString(635, 130, "Not issued")
c.drawString(635, 94, "SPECIMEN ONLY")
c.setStrokeColor(BLUE)
c.line(62, 77, w - 58, 77)
centered(c, "SAMPLE - NOT VALID FOR AWARD. No qualification, accreditation or professional licence is implied.", 56, "AcademySans", 8, GREY)
centered(c, "academy.solvaone.co.ke", 41, "AcademySans", 8, GREY)
c.showPage()
c.save()

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="AcademyHeading", fontName="AcademySansBold", fontSize=13, leading=17, textColor=BLUE, spaceAfter=12))
styles.add(ParagraphStyle(name="Question", fontName="AcademySansBold", fontSize=10, leading=13, spaceAfter=5))
styles.add(ParagraphStyle(name="Option", fontName="AcademySans", fontSize=9.5, leading=12.5, leftIndent=12, spaceAfter=2))
styles.add(ParagraphStyle(name="Answer", fontName="AcademySans", fontSize=9.5, leading=13, spaceAfter=8))
styles.add(ParagraphStyle(name="SmallNote", fontName="AcademySans", fontSize=9, leading=13, textColor=GREY, spaceAfter=12))

def page_header(c, doc):
    pw, ph = A4
    c.setFillColor(BLUE)
    c.rect(0, ph - 8, pw, 8, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont("AcademySansBold", 10)
    c.drawString(45, ph - 37, "SOLVA HR ACADEMY")
    c.setFillColor(GREY)
    c.setFont("AcademySans", 8)
    c.drawRightString(pw - 45, ph - 37, "HR PRACTICE FROM A TO Z")
    c.setStrokeColor(colors.HexColor("#D9DFE8"))
    c.line(45, 37, pw - 45, 37)
    c.drawString(45, 24, "DRAFT FOR INSTRUCTOR REVIEW | Practice checks, not an accredited examination")
    c.drawRightString(pw - 45, 24, str(doc.page))

pack_path = OUT / "HR-Practice-Knowledge-Checks-and-Answer-Key.pdf"
doc = SimpleDocTemplate(str(pack_path), pagesize=A4, rightMargin=45, leftMargin=45, topMargin=62, bottomMargin=52,
                        title="HR Practice from A to Z - Draft Knowledge Checks and Instructor Answer Key", author="Solva HR Academy")
story = []
for idx, check in enumerate(checks):
    story.append(Paragraph(f"Class {check['class']:02d}: {escape(check['title'])}", styles["AcademyHeading"]))
    story.append(Paragraph("Choose one answer for each question. Suggested time: 3-5 minutes.", styles["SmallNote"]))
    for number, question in enumerate(check["questions"], 1):
        group = [Paragraph(f"{number}. {escape(question['prompt'])}", styles["Question"])]
        group += [Paragraph(f"{chr(65+i)}. {escape(option)}", styles["Option"]) for i, option in enumerate(question["options"])]
        group.append(Spacer(1, 9))
        story.append(KeepTogether(group))
    if idx % 2 == 1:
        story.append(PageBreak())
    else:
        story.append(Spacer(1, 14))
story.append(Paragraph("Instructor answer key", styles["AcademyHeading"]))
story.append(Paragraph("Draft questions based on the supplied 448-slide masterclass deck. Review wording and accuracy before activating. These are formative checks with feedback; no pass mark or certificate eligibility has been activated.", styles["SmallNote"]))
for check in checks:
    items = [Paragraph(f"Class {check['class']:02d}: {escape(check['title'])}", styles["AcademyHeading"])]
    for n, q in enumerate(check["questions"], 1):
        items.append(Paragraph(f"{n}. {chr(65+q['correct'])} - {escape(q['explanation'])}", styles["Answer"]))
    story.append(KeepTogether(items))
    story.append(Spacer(1, 6))
doc.build(story, onFirstPage=page_header, onLaterPages=page_header)
print(json.dumps({"certificate":str(cert_path), "checks":str(pack_path), "questions":sum(len(x["questions"]) for x in checks)}))
