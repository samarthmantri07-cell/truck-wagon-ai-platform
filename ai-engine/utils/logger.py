import logging
import sys
from datetime import datetime
from config.paths import LOGS_DIR

def get_logger(name: str) -> logging.Logger:
    """
    Creates an enterprise-grade logger that logs to both console and file.
    """
    logger = logging.getLogger(name)
    if logger.hasHandlers():
        return logger

    logger.setLevel(logging.DEBUG)

    # Formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    # Console Handler
    ch = logging.StreamHandler(sys.stdout)
    ch.setLevel(logging.INFO)
    ch.setFormatter(formatter)
    logger.addHandler(ch)

    # File Handler
    log_file = LOGS_DIR / f"{datetime.now().strftime('%Y-%m-%d')}_ai_engine.log"
    fh = logging.FileHandler(log_file)
    fh.setLevel(logging.DEBUG)
    fh.setFormatter(formatter)
    logger.addHandler(fh)

    return logger

# Default logger
logger = get_logger("AIEngine")
