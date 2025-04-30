from django import forms
from .models import Question

class QuestionForm(forms.Form):
    question_id = forms.IntegerField(widget=forms.HiddenInput())
    selected_option = forms.CharField(widget=forms.RadioSelect(choices=[]))
