from agno.agent import Agent
from agno.models.google import Gemini
from agno.db.sqlite import AsyncSqliteDb
from agno.os import AgentOS
from dotenv import load_dotenv
load_dotenv('../.env')
# import os
# print(os.getenv("GOOGLE_API_KEY"))

assistant = Agent(
    name="Assistant",
    model=Gemini(id="gemini-2.5-flash"),
    db=AsyncSqliteDb(db_file="my_os.db"),
    instructions=["You are a helpful AI assistant."],
    markdown=True,
)

agent_os = AgentOS(
    id="my-first-os",
    description="My first AgentOS",
    agents=[assistant],
)

app = agent_os.get_app()

@app.get('/hello')
def hello():
    return "Hello World"

if __name__ == "__main__":
    # Default port is 7777; change with port=...
    agent_os.serve(app="index:app", reload=False, port=8000)