const WebhookMessageResponse = async (req, res) => {
  try {
    console.log("data")
    let notificationObject = {
      title: "New message ",
      body: "",
      userId: "",
    };
    const { ruffdata } = { ...req.body, ...req.params, ...req.query };
    const { xml } = { ...req.body, ...req.params, ...req.query };
    const response = await WebhookMessageModal.create({
      messageJson: ruffdata,
    });
    if (xml) {
      xml2js.parseString(xml, async (err, result) => {
        if (err) {
          throw err;
        }
        let parsedObject = { ...result.TRUMPIA };
        Object.keys(parsedObject).map(function (key, index) {
          parsedObject[key] = parsedObject[key][0];
        });
        const response = await WebhookMessageModal.create({
          messageJson: parsedObject,
        });
        const contact = await Contact.findOne({
          contactid: parsedObject.SUBSCRIPTION_UID,
        });
        let data = {
          sender: 2,
          type: parsedObject.KEYWORD ? parsedObject.KEYWORD : "REPLY",
          imageUrl: parsedObject.ATTACHMENT ? parsedObject.ATTACHMENT : "",
          message: parsedObject.CONTENTS,
          read: false,
          contactid: parsedObject.SUBSCRIPTION_UID,
        };
        if (contact) {
          data.contact = contact._id;
          data.userId = contact.userId;
          //for notification
          notificationObject.title = `${
            contact.firstName ? contact.firstName : ""
          } ${contact.lastName ? contact.lastName : ""}`;
          notificationObject.userId = contact.userId;
        }
        if (parsedObject.CONTENTS) {
          notificationObject.body = parsedObject.CONTENTS;
        }

        await Message.create(data);
        global.io.emit("getNotifications", notificationObject);
        return res.status(200).send({ status: 200 });
      });
    } else {
      return res.status(200).send({ status: 200 });
    }
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong, please try again laterr!",
      error: err.message,
    });
  }
};
