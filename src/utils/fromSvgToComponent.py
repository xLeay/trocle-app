import os
import re

def extract_paths(svg_file):
    """Extrait les éléments <path> d'un fichier SVG."""
    if not svg_file:
        return []
    with open(svg_file, "r", encoding="utf-8") as f:
        content = f.read()
    # Recherche des balises <path ... />
    paths = re.findall(r'<path[^>]* d="([^"]+)"[^>]*/>', content)
    return paths

def generate_component(name, paths):
    """Génère un composant TypeScript pour une icône avec un ou plusieurs chemins."""
    if len(paths) == 1:
        # Si un seul chemin, on utilise la fonction createSinglePathSVG
        return f"""
import {{ createSinglePathSVG }} from './iconsTemplate';

const path = `{paths[0]}`;

const {name} = createSinglePathSVG({{path}});

export default {name};
"""
    else:
        # Si plusieurs chemins, on utilise la fonction createMultiPathSVG
        paths_str = ",\n  ".join([f'"{path}"' for path in paths])
        return f"""
import {{ createMultiPathSVG }} from './iconsTemplate';

const paths = [\n  {paths_str}\n];

const {name} = createMultiPathSVG({{ paths }});

export default {name};
"""

def process_folder(folder):
    """Parcourt les fichiers SVG et génère des composants TypeScript."""
    icons = {}

    # Grouper les fichiers par nom d'icône et variante
    for file in os.listdir(folder):
        if file.endswith(".svg"):
            # Diviser le fichier en <name>, <variant>, <style>
            parts = file.replace(".svg", "").rsplit("_", 2)
            if len(parts) == 3:
                name, variant, style = parts
                key = f"{name}_{style}"  # Regrouper par nom et style (ex : accessibility_rounded)
                if key not in icons:
                    icons[key] = {}
                icons[key][variant] = os.path.join(folder, file)

    # Générer les composants
    for key, variants in icons.items():
        name, style = key.rsplit("_", 1)
        paths = []
        # On récupère les chemins pour "filled" et "stroke"
        if "filled" in variants:
            paths.extend(extract_paths(variants["filled"]))
        if "stroke" in variants:
            paths.extend(extract_paths(variants["stroke"]))

        # On génère le nom du composant
        component_name = f"{name.capitalize()}{style.capitalize()}"
        component = generate_component(component_name, paths)

        # Écrire le fichier TypeScript
        with open(f"{component_name}.tsx", "w", encoding="utf-8") as f:
            f.write(component)

# Dossier contenant les fichiers SVG
process_folder("./icons")
