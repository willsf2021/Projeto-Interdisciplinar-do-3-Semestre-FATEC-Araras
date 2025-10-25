# management/commands/import_taco_json.py
import requests
import json
from django.core.management.base import BaseCommand
from django.db import transaction
from api.models import AlimentoTaco 

class Command(BaseCommand):
    help = 'Importa dados do TACO a partir do JSON do GitHub'

    def add_arguments(self, parser):
        parser.add_argument(
            '--url',
            type=str,
            default='https://raw.githubusercontent.com/danperrout/tabelataco/master/public/TACO.json',
            help='URL do JSON TACO'
        )

    def handle(self, *args, **options):
        url = options['url']
        
        self.stdout.write(f'Baixando dados de: {url}')
        
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            
            self.stdout.write(f'Encontrados {len(data)} alimentos para importar')
            
            imported_count = 0
            skipped_count = 0
            
            with transaction.atomic():
                for item in data:
                    try:
                        # Mapeamento dos campos do JSON para o modelo
                        alimento, created = AlimentoTaco.objects.update_or_create(
                            codigo_taco=str(item.get('id', '')).strip(),
                            defaults={
                                'nome': item.get('name', '').strip(),
                                'categoria': item.get('category', '').strip(),
                                'valor_energetico': self._parse_decimal(item.get('energy_kcal')),
                                'proteinas': self._parse_decimal(item.get('protein_g')),
                                'carboidratos': self._parse_decimal(item.get('carbohydrate_g')),
                                'acucares_totais': self._parse_decimal(item.get('sugar_g')),
                                'acucares_adicionados': self._parse_decimal(item.get('added_sugar_g', 0)),
                                'gorduras_totais': self._parse_decimal(item.get('lipid_g')),
                                'gorduras_saturadas': self._parse_decimal(item.get('saturated_g')),
                                'gorduras_trans': self._parse_decimal(item.get('trans_g', 0)),
                                'fibra_alimentar': self._parse_decimal(item.get('fiber_g')),
                                'sodio': self._parse_decimal(item.get('sodium_mg')),
                            }
                        )
                        
                        if created:
                            imported_count += 1
                        else:
                            skipped_count += 1
                            
                    except Exception as e:
                        self.stdout.write(
                            self.style.ERROR(f'Erro ao importar {item.get("name", "Unknown")}: {str(e)}')
                        )
                        skipped_count += 1
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Importação concluída! {imported_count} novos importados, {skipped_count} ignorados/atualizados'
                )
            )
            
        except requests.RequestException as e:
            self.stdout.write(self.style.ERROR(f'Erro ao baixar JSON: {str(e)}'))
        except json.JSONDecodeError as e:
            self.stdout.write(self.style.ERROR(f'Erro ao decodificar JSON: {str(e)}'))

    def _parse_decimal(self, value):
        """Converte valores para decimal, tratando casos especiais"""
        if value is None:
            return 0
        try:
            # Remove possíveis caracteres não numéricos e converte
            if isinstance(value, str):
                value = value.replace(',', '.').strip()
                # Remove caracteres não numéricos exceto ponto e sinal negativo
                value = ''.join(char for char in value if char.isdigit() or char in '.-')
            return float(value) if value != '' else 0
        except (ValueError, TypeError):
            return 0