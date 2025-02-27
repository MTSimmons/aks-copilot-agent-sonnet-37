## Initial Prompt (Copilot Edits, Agent,  Claude 3.7 Sonnet (Preview) ):

"I want to create a demo environment in Azure that is running on an AKS.  
I want to build the environment with Terraform.  
Keep the terraform in a "terraform" folder.  Use reasonable variables for things like resource group, location, node pool count and vm size. For the VM size, use a 2 core, 8 GB ram VM.  For node pool count, have 2 VMs.
To demonstrate the AKS I want to create a simple web app that uses my Azure OpenAI deployment to have a chat session. The chat session should look modern, and should remember the context of the chat session as a thread.
Keep the app in a wep-app folder.  It can be made in any language. My OpenAI deployment endpoint is "https://simmons-ai.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-08-01-preview".  I have a key that starts with "86e7..." which I'd like to keep in a .env file.
I want to use git for version control.  Please create a .gitignore that covers all the things in the terraform and web-app folders that should be kept out of version control."


### (A few other prompts to handle some debugging, Q/A, etc.)

(Debugging prompts not added here. Have fun!)


## Suggest New Features Prompt (Chat,  Claude 3.7 Sonnet (Preview) )

@workspace Suggest features to add to the web-app to improve functionality.
Output them without code, just user stories.

## Add New Feature Prompt (Copilot Edits, Agent, Claude 3.7 Sonnet (Preview) )

Implement this user story for the web app:
User Experience Enhancements
Dark Mode Toggle - Allow users to switch between light and dark themes for better readability in different lighting conditions.

