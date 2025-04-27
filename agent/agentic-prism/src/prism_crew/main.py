import os
import logging
from dotenv import load_dotenv
from prism_crew import PrismCrew

# Set up logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def validate_environment():
    """Validate that all required environment variables are set"""
    required_vars = [
        'OPENAI_API_KEY',
        'BRAVE_API_KEY',
    ]

    missing_vars = [var for var in required_vars if not os.getenv(var)]

    if missing_vars:
        raise EnvironmentError(
            f"Missing required environment variables: {', '.join(missing_vars)}"
        )


def run_analysis(statement: str) -> dict:
    """Run the financial analysis crew on the given statement"""
    try:
        # Load environment variables
        load_dotenv()

        # Validate environment
        validate_environment()

        # Initialize inputs
        inputs = {'input_statement': statement}

        # Log analysis start
        logger.info(f"Starting analysis for statement: {statement}")

        # Create and run the crew
        crew = PrismCrew()
        results = crew.crew().kickoff(inputs=inputs)

        # Log completion
        logger.info("Analysis completed successfully")

        return results

    except Exception as e:
        logger.error(f"Error during analysis: {str(e)}")
        raise


def main():
    """Main entry point for the script"""
    try:
        statement = "1+1=4"
        results = run_analysis(statement)
        logger.info("Analysis Results:")
        logger.info(results)

    except Exception as e:
        logger.error(f"Failed to complete analysis: {str(e)}")
        exit(1)


if __name__ == "__main__":
    main()
