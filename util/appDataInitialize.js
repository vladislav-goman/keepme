const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Color = require("../models/color");

module.exports = async () => {
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
  const hashedPassword = await bcrypt.hash("1111", 12);
  User.create({
    email: "vlad.mangoman@gmail.com",
    password: hashedPassword,
    login: "Vladislav",
    isAdmin: true,
  }).then((currentUser) => {
    currentUser.createNote({
      title: "A Simple Component",
      text:
        "React components implement a render() method that takes input data and returns what to display. This example uses an XML-like syntax called JSX. Input data that is passed into the component can be accessed by render() via this.props.",
      colorId: 2,
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
      title: "Passing Data Through Props ",
      text:
        "To get our feet wet, let’s try passing some data from our Board component to our Square component. We strongly recommend typing code by hand as you’re working through the tutorial and not using copy/paste. This will help you develop muscle memory and a stronger understanding.",
      colorId: 7,
    });
    currentUser.createTag({
      name: "mesha",
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
};
