const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Color = require("../models/color");
const Language = require("../models/language");

module.exports = async () => {
  Language.create({
    name: "Русский",
    shortName: "ru",
    imageUrl: "/img/rus.svg",
  });
  Language.create({
    name: "English",
    shortName: "en",
    imageUrl: "/img/en.svg",
  });
  Color.create({
    name: "White",
    hash: "#ffffff",
  });
  Color.create({
    name: "Gray",
    hash: "#e8eaed",
  });
  Color.create({
    name: "Brown",
    hash: "#e6c9a8",
  });
  Color.create({
    name: "Pink",
    hash: "#fdcfe8",
  });
  Color.create({
    name: "Purple",
    hash: "#d7aefb",
  });
  Color.create({
    name: "Dark Blue",
    hash: "#aecbfa",
  });
  Color.create({
    name: "Blue",
    hash: "#cbf0f8",
  });
  Color.create({
    name: "Salad",
    hash: "#a7ffeb",
  });
  Color.create({
    name: "Green",
    hash: "#ccff90",
  });
  Color.create({
    name: "Yellow",
    hash: "#fff475",
  });
  Color.create({
    name: "Orange",
    hash: "#fbbc04",
  });
  Color.create({
    name: "Red",
    hash: "#f28b82",
  });
  const testHashedPassword = await bcrypt.hash("1111", 12);

  User.create({
    email: "vlad.mangoman@gmail.com",
    password: testHashedPassword,
    login: "Vladislav",
    isAdmin: true,
    languageId: 1,
  }).then((currentUser) => {
    currentUser.createNote({
      title: "A Simple Component",
      text:
        "React components implement a render() method that takes input data and returns what to display. This example uses an XML-like syntax called JSX. Input data that is passed into the component can be accessed by render() via this.props.",
      colorId: 2,
      isPinned: true,
    });
    currentUser.createNote({
      title: "A Stateful Component",
      text:
        "In addition to taking input data (accessed via this.props), a component can maintain internal state data (accessed via this.state). When a component’s state data changes, the rendered markup will be updated by re-invoking render().",
      colorId: 3,
    });
    currentUser.createNote({
      title: "An Application",
      text:
        "Using props and state, we can put together a small Todo application. This example uses state to track the current list of items as well as the text that the user has entered. Although event handlers appear to be rendered inline, they will be collected and implemented using event delegation.",
      colorId: 4,
    });
    currentUser.createNote({
      title: "A Component Using External Plugins",
      text:
        "React allows you to interface with other libraries and frameworks. This example uses remarkable, an external Markdown library, to convert the <textarea>’s value in real time.",
      colorId: 5,
    });
    currentUser.createNote({
      text:
        "React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called “components”.",
      colorId: 6,
    });
    currentUser.createNote({
      title: "Passing Data Through Props",
      text:
        "To get our feet wet, let’s try passing some data from our Board component to our Square component. We strongly recommend typing code by hand as you’re working through the tutorial and not using copy/paste. This will help you develop muscle memory and a stronger understanding.",
      colorId: 7,
    });
    currentUser.createNote({
      title: "Погулять с собакой",
      text: "Важно не забыть выгулять Тузика",
      colorId: 8,
      isPinned: true,
    });
    currentUser.createNote({
      title: "Покормить кота",
      text: "Покормить пушистого котика",
      colorId: 8,
      isPinned: true,
    });
    currentUser.createNote({
      title: "Сделать курсовой проект",
      text: "Сделать и сдать курсовой до 15 мая",
      colorId: 9,
      isPinned: true,
    });
    currentUser.createNote({
      title: "Random note",
      text:
        "To connect to the database, you must create a Sequelize instance. This can be done by either passing the connection parameters separately to the Sequelize constructor or by passing a single connection URI",
      colorId: 10,
      isArchived: true,
    });
    currentUser.createNote({
      title: "Note: setting up SQLite",
      text: "If you're using SQLite, you should use the following instead",
      colorId: 11,
      isArchived: true,
    });
    currentUser.createNote({
      title: "Note: connection pool (production)",
      text:
        "If you're connecting to the database from a single process, you should create only one Sequelize instance. Sequelize will set up a connection pool on initialization. This connection pool can be configured through the constructor's options parameter (using options.pool).",
      colorId: 12,
    });

    currentUser.createTag({
      name: "love",
      description: "Nice moments with mesha",
    });
    currentUser.createTag({
      name: "cats",
      description: "Notes connected to cats",
    });
    currentUser.createTag({
      name: "react",
      description: "React JS development",
    });
    currentUser.createTag({
      name: "URGENT",
      description: "Very important notes",
    });
    currentUser.createTag({
      name: "friends",
      description: "Friends and chill",
    });
    currentUser.createTag({
      name: "todo",
      description: "Things i'd need to do.",
    });
    currentUser.createTag({
      name: "javascript",
      description: "Useful JS tips",
    });
  });

  const hashedPassword = await bcrypt.hash("test", 12);

  User.create({
    email: "test@gmail.com",
    password: hashedPassword,
    login: "Anonym User",
    languageId: 1,
  }).then((currentUser) => {
    currentUser.createNote({
      title: "Погулять с собакой",
      text: "Важно не забыть выгулять Тузика",
      colorId: 8,
      isPinned: true,
    });
    currentUser.createNote({
      title: "Покормить кота",
      text: "Покормить пушистого котика",
      colorId: 8,
      isPinned: true,
    });
    currentUser.createNote({
      title: "Сделать курсовой проект",
      text: "Сделать и сдать курсовой до 15 мая",
      colorId: 9,
      isPinned: true,
    });
    currentUser.createNote({
      title: "УПРАВЛЕНИЕ ТРАНЗАКЦИЯМИ",
      isPinned: true,
      text:
        "Поддержка механизма транзакций – показатель уровня развитости СУБД. Корректное поддержание транзакций одновременно является основой обеспечения целостности баз данных (и поэтому транзакции вполне уместны и в однопользовательских персональных СУБД), а также составляют базис изолированности пользователей в многопользовательских системах. Часто эти два аспекта рассматриваются по отдельности, но на самом деле они взаимосвязаны.",
      colorId: 1,
    });
    currentUser.createNote({
      title: "Атомарность (Atomicy).",
      text:
        "Это свойство означает, что результаты всех операций, успешно выполненных в пределах транзакции, должны быть отражены в состоянии базы данных, либо в состоянии базы данных не должно быть отражено действие ни одной операции (конечно, здесь речь идет об операциях, изменяющих состояние базы данных). Свойство атомарности, которое часто называют свойством “все или ничего”, позволяет относиться к транзакции, как к динамически образуемой составной операции над базой данных (в общем случае состав и порядок выполнения операций, выполняемых внутри транзакции, становится известным только на стадии выполнения).",
      colorId: 2,
    });
    currentUser.createNote({
      title: "Согласованность (Consistency).",
      text:
        "В классическом смысле это свойство означает, что транзакция может быть успешно завершена с фиксацией результатов своих операций только в том случае, когда действия операций не нарушают целостность базы данных, т.е. удовлетворяют набору ограничений целостности, определенных для этой базы данных. Это свойство расширяется тем, что во время выполнения транзакции разрешается устанавливать  точки  согласованности и явным  образом  проверять ограничения целостности. В контексте баз данных термины согласованность и целостность эквивалентны. Единственным критерием согласованности данных является их  удовлетворение  ограничениям  целостности,  т.е.  база  данных  находится  в согласованном состоянии тогда и только тогда, когда она находится в целостном состоянии",
      colorId: 3,
      isPinned: true,
    });
    currentUser.createNote({
      title: "Изоляция (Isolation).",
      text:
        "Требуется, чтобы две одновременно (параллельно или квазипараллельно) выполняемые транзакции никоим образом не действовали одна на другую. Другими словами, результаты выполнения операций транзакции T1 не должны быть видны никакой другой транзакции T2 до тех пор, пока транзакция T1 не завершится успешным образом.",
      colorId: 4,
    });
    currentUser.createNote({
      title: "Долговечность  (Durability).",
      text:
        "После  успешного  завершения  транзакции  все изменения, которые были внесены в состояние базы данных операциями этой транзакции, должны гарантированно сохраняться, даже в случае сбоев аппаратуры или программного обеспечения.",
      colorId: 5,
      isPinned: true,
    });
    currentUser.createNote({
      title: "Database",
      text:
        "Database, also called electronic database, any collection of data, or information, that is specially organized for rapid search and retrieval by a computer. Databases are structured to facilitate the storage, retrieval, modification, and deletion of data in conjunction with various data-processing operations. A database management system (DBMS) extracts information from the database in response to queries.",
      colorId: 6,
      isArchived: true,
    });
    currentUser.createNote({
      text:
        "Increasingly, formerly separate databases are being combined electronically into larger collections known as data warehouses. Businesses and government agencies then employ “data mining” software to analyze multiple aspects of the data for various patterns. For example, a government agency might flag for human investigation a company or individual that purchased a suspicious quantity of certain equipment or materials, even though the purchases were spread around the country or through various subsidiaries.",
      colorId: 7,
      isPinned: true,
      isArchived: true,
    });
    currentUser.createNote({
      title: "Использование SQL с другим языком",
      text:
        "Основные логические конструкции ветвления и циклов – используемые для структур большинства сред программирования, здесь отсутствуют, поэтому невозможно принять решение – выполнять ли, как выполнять, или как долго выполнять одно действие в результате другого действия. Кроме того, интерактивный SQL не может делать многого со значениями, кроме ввода их в таблицу, размещения или распределения их с помощью запросов, и конечно вывода их на какое-то устройство.",
      colorId: 8,
    });
    currentUser.createNote({
      title: "Hello World",
      text:
        "In this guide, we will examine the building blocks of React apps: elements and components. Once you master them, you can create complex apps from small reusable pieces.",
      colorId: 9,
      isArchived: true,
    });
    currentUser.createNote({
      title: "Knowledge Level Assumptions ",
      text:
        "React is a JavaScript library, and so we’ll assume you have a basic understanding of the JavaScript language. If you don’t feel very confident, we recommend going through a JavaScript tutorial to check your knowledge level and enable you to follow along this guide without getting lost. It might take you between 30 minutes and an hour, but as a result you won’t have to feel like you’re learning both React and JavaScript at the same time.",
      colorId: 10,
      isPinned: true,
    });
    currentUser.createNote({
      title: "Let’s Get Started!",
      text:
        "Keep scrolling down, and you’ll find the link to the next chapter of this guide right before the website footer.",
      colorId: 11,
    });
    currentUser.createNote({
      title: "State and Lifecycle",
      text:
        "Consider the ticking clock example from one of the previous sections. In Rendering Elements, we have only learned one way to update the UI. We call ReactDOM.render() to change the rendered output:",
      colorId: 12,
    });
    currentUser.createNote({
      text:
        "However, it misses a crucial requirement: the fact that the Clock sets up a timer and updates the UI every second should be an implementation detail of the Clock.",
      colorId: 3,
    });

    currentUser.createTag({
      name: "love",
      description: "Notes about Mary",
    });
    currentUser.createTag({
      name: "fashion",
      description: "Fashion connected notes",
    });
    currentUser.createTag({
      name: "job",
      description: "My working duties and moments",
    });
    currentUser.createTag({
      name: "happy",
      description: "Things that make me happy",
    });
    currentUser.createTag({
      name: "me",
      description: "Me and myself. Self-dedicated notes",
    });
    currentUser.createTag({
      name: "art",
      description: "Art and beautifyl things",
    });
    currentUser.createTag({
      name: "todo",
      description: "Things I need to do",
    });
    currentUser.createTag({
      name: "warning",
      description: "Нужно быть осторожнее с этим",
    });
    currentUser.createTag({
      name: "URGENT",
      description: "Очень срочные заметки!",
    });
    currentUser.createTag({
      name: "nature",
      description: "Природа",
    });
    currentUser.createTag({
      name: "хештег_на_русском",
      description: "Моэно добавлять хештеги на русском языке",
    });
    currentUser.createTag({
      name: "database",
      description: "Databases are my entire life",
    });
  });
};
