# utils.py
from transformers import BartForConditionalGeneration, BartTokenizer
from PyPDF2 import PdfReader
from docx import Document
import re
import torch

class DocumentSummarizer:
    def __init__(self, model_name="facebook/bart-large-cnn"):
        self.model = BartForConditionalGeneration.from_pretrained(model_name)
        self.tokenizer = BartTokenizer.from_pretrained(model_name)
    
    def extract_text_from_pdf(self, file):
        reader = PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text

    def preprocess_text(self, text):
        text = re.sub(r"[^\w\s.,]", "", text)
        text = re.sub(r"\s+", " ", text)
        return text.strip()

    def summarize_text(self, text, min_length=100, max_length=300):
        inputs = self.tokenizer(text, max_length=1024, truncation=True, return_tensors="pt")
        
        summary_ids = self.model.generate(
            inputs.input_ids,
            min_length=min_length,
            max_length=max_length,
            length_penalty=2.0,
            num_beams=4,
            early_stopping=True
        )
        
        return self.tokenizer.decode(summary_ids[0], skip_special_tokens=True)