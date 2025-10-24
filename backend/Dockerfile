FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user (but with sudo for CTF purposes)
RUN useradd -m -s /bin/bash dvtc && \
    echo "dvtc:dvtc" | chpasswd && \
    chown -R dvtc:dvtc /app

# VULNERABILITY: Running as root would be more secure than this half-measure
USER dvtc

# Expose port
EXPOSE 8000

# VULNERABILITY: Debug mode enabled in production
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBUG=true

# Start the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]