# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

import sys
import os
project = 'Platforma Konkursowa'
copyright = '2023, Kinga Świderek, Filip Budzyński, Jan Filipecki, Jakub Kowalczyk, Jakub Podrażka'
author = 'Kinga Świderek, Filip Budzyński, Jan Filipecki, Jakub Kowalczyk, Jakub Podrażka'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = ["sphinx.ext.autodoc",
              'sphinx.ext.coverage', 'sphinx.ext.napoleon']

templates_path = ['_templates']
exclude_patterns = []

language = 'pl'

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'alabaster'
html_static_path = ['_static']

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.

# The following lines ensure that the path to your source files are defined.
sys.path.insert(0, os.path.abspath('../..'))
# TODO dodać scieżke do /frontend kiedy powstanie żeby autodoc widział
