FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    fonts-liberation \
    wget \
    fontconfig \
    && rm -rf /var/lib/apt/lists/*

# Pobierz Google Fonts używane przez style napisów
RUN mkdir -p /usr/share/fonts/truetype/captions && \
    wget -q "https://raw.githubusercontent.com/google/fonts/main/ofl/anton/Anton-Regular.ttf" \
        -O /usr/share/fonts/truetype/captions/Anton-Regular.ttf && \
    wget -q "https://raw.githubusercontent.com/google/fonts/main/ofl/bangers/Bangers-Regular.ttf" \
        -O /usr/share/fonts/truetype/captions/Bangers-Regular.ttf && \
    wget -q "https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/static/Montserrat-Bold.ttf" \
        -O /usr/share/fonts/truetype/captions/Montserrat-Bold.ttf && \
    wget -q "https://raw.githubusercontent.com/google/fonts/main/ofl/bebasneuenew/BebasNeue-Regular.ttf" \
        -O /usr/share/fonts/truetype/captions/BebasNeue-Regular.ttf && \
    wget -q "https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexsans/IBMPlexSans-Bold.ttf" \
        -O /usr/share/fonts/truetype/captions/IBMPlexSans-Bold.ttf && \
    fc-cache -fv

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN mkdir -p data/temp data/output
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--timeout", "600", "--workers", "2", "app:create_app()"]
