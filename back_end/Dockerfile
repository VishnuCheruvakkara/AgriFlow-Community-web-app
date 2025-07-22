FROM python:3.12-slim-bullseye

# Avoid .pyc files and enable stdout logs
ENV PYTHONDONTWRITEBYCODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory inside container
WORKDIR /app

# Install system packages needed for psycopg2 (PostgreSQL)
RUN apt-get update && apt-get install -y --no-install-recommends\
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN python -m pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

EXPOSE 8000

# Run the Daphne ASGI server
CMD ["daphne","-b","0.0.0.0","-p","8000","agri_flow.asgi:application"]
