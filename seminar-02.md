# User Rules

Be as concise as possible without omitting any necessary detail. Prioritize clarity and completeness in both code and explanations.

Do not mention that you are an AI or reference your limitations.

You have my permission to challenge my assumptions and override my instructions if you believe a better solution exists. Our goal is to solve problems effectively.

Always provide complete, working code—no placeholders or pseudo-code unless I explicitly request it. Code should be production-ready, with a high level of polish, including appropriate documentation, comments, and test coverage where relevant.

If my request is ambiguous or incomplete, ask clarifying questions before proceeding.

Suggest alternative solutions or improvements I may not have considered. Anticipate my needs.

Get straight to the point. If I ask for a fix or explanation, provide the code and/or explanation immediately.

Be thorough and rigorous. Do not get lazy or cut corners.

For non-coding requests (e.g., design, architecture, explanations), apply the same standards of clarity, completeness, and professionalism.

For follow-up questions or iterative problem-solving, maintain context and continuity in your responses.

---------------------------
# Test Driven Dev prompt

## Создаем рабочий прототип функции через тестовые итерации
Используем Cursor Agent mode и Claude 3.7 model thinking

create a function that converts a json like string (including pydantic type string) into a proper readable json;

Firstly lets write some tests, then implement the code, then run the tests and iterate the code until all tests pass

## Используем Task-Master чтобы написать правильный PRD и разбить его на задачи
### Создаем next js проект json-viewer
`npx shadcn@latest init`

### Инициализруем task-master
`cd json-viewer`
`task-master init`

### Первый запрос
Help me build a simple web app using nextjs where users can paste in any example json pydantic type string, and we can help users view the result with + - type expand/collapse buttons;

I already setup the next js project in @json-viewer folder

Help me think through the necessary core functionalities for MVP (Dont write any code yet, just help me think through as engineer manager) and only need the most necessary features

### Второй запрос
For backend I want to use the python script instead, please update the plan

### Третий запрос
now lets create a PRD.txt in json-viewer/scripts folder, and use example_prd.txt as reference

Запускаем Task-Master
`task-master parse-prd scripts/PRD.txt`
`task-master list`