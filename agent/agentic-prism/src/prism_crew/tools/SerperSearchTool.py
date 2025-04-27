import os
import json
import requests
from langchain_core.tools import BaseTool

class SerperSearchTool(BaseTool):
  name: str = "serper_internet_search"
  description: str = (
    "Useful to search the internet using the Serper API "
    "about a given topic and return relevant results. "
    "Input should be a query. "
    "For example, 'What is an LLM?'."
  )
  
  def _run(self, query: str) -> str:
    url = "https://google.serper.dev/search"
    
    payload = json.dumps({
      "q": query,
      "num": 10
    })
    
    headers = {
      'X-API-KEY': os.environ['SERPER_API_KEY'],
      'Content-Type': 'application/json'
    }
    
    try:
      response = requests.post(url, headers=headers, data=payload)
      response.raise_for_status()
      results = response.json().get('organic', [])
      
      formatted_results = []
      for result in results[:5]:
        formatted_results.append('\n'.join([
          f"Title: {result.get('title', 'No title')}",
          f"Link: {result.get('link', 'No link')}",
          f"Snippet: {result.get('snippet', 'No snippet')}",
          "\n-----------------"
        ]))
      
      return '\n'.join(formatted_results)
    except requests.RequestException as e:
      return f"An error occurred: {str(e)}"