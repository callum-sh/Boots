FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 MPLCONFIGDIR=/tmp/matplotlib
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["gunicorn", "core.wsgi", "--bind", "0.0.0.0:8000", "--workers", "2", "--timeout", "60"]
