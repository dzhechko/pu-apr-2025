# Prompt для chai.new

Cоздай агента финансового советника 

Data Collection: Users enter financial information (income, expenses, debts) either manually or via CSV upload.

Agent Chain Execution: workflow agent executes its sub-agents in the order they are specified in the list:

Budget Analysis Agent evaluates spending patterns and identifies areas for reduction

Savings Strategy Agent develops savings plans based on budget analysis

Debt Reduction Agent creates optimized debt payoff strategies using both analytical methods

State Management: Each agent stores its results in the shared session state, allowing subsequent agents to build upon prior analysis. This state-passing mechanism enables a coherent analysis pipeline without duplicating work.

# Блок схема решения
flowchart TD
    A["Пользовательский запрос"] --> B["Анализ запроса\n(Агент-аналитик)"]
    B --> C["Извлечение советов\nиз памяти\n(Агент памяти)"]
    C --> D["Генерация персонального\nсовета\n(Агент-консультант)"]
    D --> E["План действий\n(Агент-планировщик)"]
    E --> F["Форматирование ответа\n(Агент-редактор)"]
    F --> G["Готовый\nструктурированный ответ"]

    subgraph Tools ["Инструменты"]
        T1["Калькулятор бюджета"]
        T2["Анализатор финансовых метрик"]
    end

    D -- "Использует" --> T1
    D -- "Использует" --> T2

