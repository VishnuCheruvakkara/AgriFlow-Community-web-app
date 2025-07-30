FROM python:3.11.1

# Avoid .pyc files and enable stdout logs
ENV PYTHONDONTWRITEBYCODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory inside container
WORKDIR /app


# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN python -m pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Collect static files for production (AFTER code copy)
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# RUN python manage.py collectstatic --noinput  # for production only

# Run the Daphne ASGI server
CMD ["daphne","-b","0.0.0.0","-p","8000","agri_flow.asgi:application"]
