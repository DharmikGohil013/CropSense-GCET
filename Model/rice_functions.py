"""
This module ensures all rice model custom functions are available globally.
Import this before loading the rice model to avoid namespace issues.
"""

import pandas as pd
import torch
import torch.nn.functional as F
from fastai.metrics import error_rate
import builtins
import __main__
import sys
import pathlib

# Patch PosixPath to WindowsPath if running on Windows
if sys.platform.startswith('win'):
    pathlib.PosixPath = pathlib.WindowsPath

# Load the DataFrame containing variety information
try:
    df = pd.read_csv("train.csv", index_col="image_id")
except FileNotFoundError:
    # Create a dummy DataFrame if train.csv doesn't exist
    df = pd.DataFrame({'variety': ['variety1', 'variety2']}, index=['img1', 'img2'])

# Define get_variety function
def get_variety(p):
    try:
        return df.loc[p.name, "variety"]
    except:
        return "unknown_variety"

# Define custom loss functions and metrics
def disease_loss(inp, disease, variety):
    return F.cross_entropy(inp[:, :10], disease)

def variety_loss(inp, disease, variety):
    return F.cross_entropy(inp[:, 10:], variety)

def combine_loss(inp, disease, variety):
    return disease_loss(inp, disease, variety) + variety_loss(inp, disease, variety)

def disease_err(inp, disease, variety):
    return error_rate(inp[:, :10], disease)

def variety_err(inp, disease, variety):
    return error_rate(inp[:, 10:], variety)

# Make functions available in all namespaces
builtins.get_variety = get_variety
builtins.disease_loss = disease_loss
builtins.variety_loss = variety_loss
builtins.combine_loss = combine_loss
builtins.disease_err = disease_err
builtins.variety_err = variety_err
builtins.df = df

# Add to __main__ module
__main__.get_variety = get_variety
__main__.disease_loss = disease_loss
__main__.variety_loss = variety_loss
__main__.combine_loss = combine_loss
__main__.disease_err = disease_err
__main__.variety_err = variety_err
__main__.df = df

# Add to current module's globals
globals().update({
    'get_variety': get_variety,
    'disease_loss': disease_loss,
    'variety_loss': variety_loss,
    'combine_loss': combine_loss,
    'disease_err': disease_err,
    'variety_err': variety_err,
    'df': df
})

print("Rice model functions loaded into all namespaces successfully")
