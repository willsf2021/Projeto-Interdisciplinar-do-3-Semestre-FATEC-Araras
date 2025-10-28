from django.template.loader import render_to_string
from django.http import HttpResponse
from rest_framework.views import APIView
from weasyprint import HTML

class PdfTemplateView(APIView):
    def get(self, request):
        # Dados que vão pro template
        context = {
            "titulo": "Meu PDF estilizado",
            "conteudo": "Este é um PDF gerado a partir de um template HTML e CSS."
        }

        # Renderiza o template como HTML
        html_string = render_to_string('pdf_template.html', context)

        # Converte para PDF
        pdf_file = HTML(string=html_string).write_pdf()

        # Retorna como response
        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = 'inline; filename="meu_pdf.pdf"'
        return response
