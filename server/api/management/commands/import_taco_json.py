import json
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction
from api.models import AlimentoTaco

class Command(BaseCommand):
    help = 'Importa dados do TACO a partir de um arquivo JSON local'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str, help='./taco.json')

    def _parse_decimal(self, value):
        """Converte o valor para Decimal, tratando None, '', 'NA' e 'Tr'."""
        try:
            if value in (None, '', 'NA', 'Tr'):
                return Decimal(0)
            return Decimal(value)
        except Exception:
            return Decimal(0)

    def handle(self, *args, **options):
        json_file = options['json_file']
        
        self.stdout.write(f"Tentando abrir o arquivo: {json_file}")
        with open(json_file, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        self.stdout.write(f'Encontrados {len(data)} alimentos para importar')
            
        imported_count = 0
        skipped_count = 0
        
        with transaction.atomic():
            for item in data:
                try:
                    alimento, created = AlimentoTaco.objects.update_or_create(
                        codigo_taco=str(item.get('id', '')).strip(),
                        defaults={
                            'nome': item.get('description', '').strip(),
                            'categoria': item.get('category', '').strip(),
                            'valor_energetico': self._parse_decimal(item.get('energy_kcal')),
                            'proteinas': self._parse_decimal(item.get('protein_g')),
                            'carboidratos': self._parse_decimal(item.get('carbohydrate_g')),
                            'acucares_totais': self._parse_decimal(item.get('sugar_g', 0)),  # Alguns alimentos não têm açúcar
                            'acucares_adicionados': Decimal(0),  # TACO não fornece, pode deixar 0
                            'gorduras_totais': self._parse_decimal(item.get('lipid_g')),
                            'gorduras_saturadas': self._parse_decimal(item.get('saturated_g')),
                            'gorduras_trans': self._parse_decimal(item.get('18:1t_g', 0)),  # gorduras trans, se disponível
                            'fibra_alimentar': self._parse_decimal(item.get('fiber_g')),
                            'sodio': self._parse_decimal(item.get('sodium_mg')),
                        }
                    )
                    if created:
                        imported_count += 1
                    else:
                        skipped_count += 1

                except Exception as e:
                    self.stderr.write(f"Erro ao importar {item.get('description')}: {e}")
                    skipped_count += 1

        self.stdout.write(self.style.SUCCESS(
            f'Importados: {imported_count}, Ignorados/Atualizados: {skipped_count}'
        ))