from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from langchain_openai import ChatOpenAI
from langchain.tools.yahoo_finance_news import YahooFinanceNewsTool
from prism_crew.tools import BraveSearchTool


@CrewBase
class PrismCrew():
    """Prism Crew with multiple researchers and a consensus builder"""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    def __init__(self) -> None:
        self.llm = ChatOpenAI(model="gpt-4")
        # Initialize tools
        self.tools = {
            "brave_search": BraveSearchTool(),
            "yahoo_finance": YahooFinanceNewsTool()
        }

    @agent
    def researcher_one(self) -> Agent:
        return Agent(
            config=self.agents_config["researcher_one"],
            llm=self.llm,
            tools=[self.tools["brave_search"], self.tools["yahoo_finance"]])

    @agent
    def researcher_two(self) -> Agent:
        return Agent(
            config=self.agents_config["researcher_two"],
            llm=self.llm,
            tools=[self.tools["brave_search"], self.tools["yahoo_finance"]])

    @agent
    def consensus_builder(self) -> Agent:
        return Agent(config=self.agents_config["consensus_builder"],
                     llm=self.llm)

    @task
    def research_task_one(self) -> Task:
        return Task(config=self.tasks_config["research_task"],
                    agent=self.researcher_one())

    @task
    def research_task_two(self) -> Task:
        return Task(config=self.tasks_config["research_task"],
                    agent=self.researcher_two())

    @task
    def build_consensus(self) -> Task:
        return Task(
            config=self.tasks_config["consensus_task"],
            agent=self.consensus_builder(),
            dependencies=[self.research_task_one(),
                          self.research_task_two()])

    @crew
    def crew(self) -> Crew:
        return Crew(agents=[
            self.researcher_one(),
            self.researcher_two(),
            self.consensus_builder()
        ],
                    tasks=[
                        self.research_task_one(),
                        self.research_task_two(),
                        self.build_consensus()
                    ],
                    process=Process.sequential,
                    verbose=2)
