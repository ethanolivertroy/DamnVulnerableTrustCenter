from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import json
from datetime import datetime

from app.routes import trust_center, admin, flags, feeds, badges, reports, ai

# Create FastAPI app
app = FastAPI(
    title="DVTC Trust Center API",
    description="Damn Vulnerable Trust Center - Intentionally vulnerable for CTF",
    version="1.0.0-vulnerable",
    docs_url="/api/docs",  # VULNERABILITY: Swagger docs exposed
    redoc_url="/api/redoc"
)

# VULNERABILITY: Overly permissive CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"]  # Expose all headers
)

# Include routers
app.include_router(trust_center.router, prefix="/api", tags=["trust-center"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(flags.router, prefix="/api/flags", tags=["ctf"])
app.include_router(feeds.router, prefix="/api/feeds", tags=["feeds"])
app.include_router(badges.router, prefix="/api/badges", tags=["badges"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])

# Global exception handler that leaks information
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """VULNERABILITY: Detailed error messages in production"""
    return JSONResponse(
        status_code=500,
        content={
            "error": str(exc),
            "type": type(exc).__name__,
            "path": request.url.path,
            "method": request.method,
            "timestamp": datetime.now().isoformat(),
            "debug_mode": os.getenv("DEBUG", "false"),
            "hint": "Check the developer console for more details"
        }
    )

@app.get("/")
async def root():
    """Root endpoint with too much information"""
    return {
        "application": "DVTC Trust Center",
        "version": "1.0.0-vulnerable",
        "status": "running",
        "environment": os.getenv("ENV", "production"),
        "debug": os.getenv("DEBUG", "false") == "true",
        "endpoints": {
            "trust_center": "/api/trust",
            "admin": "/api/admin",
            "flags": "/api/flags",
            "feeds": "/api/feeds",
            "badges": "/api/badges",
            "reports": "/api/reports",
            "ai": "/api/ai",
            "docs": "/api/docs"
        },
        "vulnerabilities": {
            "cors": "overly_permissive",
            "error_handling": "verbose",
            "authentication": "optional",
            "authorization": "broken"
        },
        "ctf_hint": "Start by checking /api/docs for all endpoints"
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "api": "running",
            "localstack": "connected" if os.getenv("LOCALSTACK_URL") else "not_configured",
            "database": "in_memory"
        }
    }

@app.on_event("startup")
async def startup_event():
    """Initialize application state"""
    print("Starting DVTC Trust Center API...")
    print("WARNING: This application contains intentional vulnerabilities for CTF purposes")
    print("DO NOT USE IN PRODUCTION!")

    # Initialize scoreboard file if it doesn't exist
    scoreboard_file = "/tmp/scoreboard.json"
    if not os.path.exists(scoreboard_file):
        with open(scoreboard_file, "w") as f:
            json.dump({"submissions": [], "teams": {}}, f)

    # Load flags
    flags_file = "/app/app/data/flags.json"
    if not os.path.exists(flags_file):
        print("Warning: Flags file not found, creating default...")
        os.makedirs("/app/app/data", exist_ok=True)
        with open(flags_file, "w") as f:
            json.dump([], f)

@app.get("/api/debug")
async def debug_info(request: Request):
    """VULNERABILITY: Debug endpoint exposed in production"""

    # Add FLAG11 to environment for CTF
    env_vars = dict(os.environ)
    env_vars["FLAG11_DEBUG"] = "flag{debug_in_prod}"
    env_vars["DEBUG_SECRET"] = "debug_mode_should_never_be_enabled_in_production"

    return {
        "headers": dict(request.headers),
        "cookies": request.cookies,
        "client": {
            "host": request.client.host if request.client else None,
            "port": request.client.port if request.client else None
        },
        "url": str(request.url),
        "env_vars": env_vars,  # VULNERABILITY: Exposes all environment variables including flag
        "working_dir": os.getcwd(),
        "files": os.listdir("/app") if os.path.exists("/app") else [],
        "debug_info": {
            "flag": "flag{debug_in_prod}",
            "message": "Debug mode exposes sensitive information",
            "severity": "critical"
        }
    }