import { RequestHandler } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.session.userId).exec();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

interface SignUpBody {
  username?: string;
  password?: string;
}

export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const passwordRaw = req.body.password;

  try {
    if (!username || !passwordRaw) {
      return res.status(422).send({ error: "Missing parameter!" });
    }

    const isDuplicatedUser = !!(await UserModel.findOne({
      username: username,
    }).exec());

    if (isDuplicatedUser) {
      return res.status(422).send({ error: "Username already taken!" });
    }

    if (username.length <= 2) {
      return res
        .status(422)
        .send({ error: "Username should be at least 3 characters long!" });
    }

    if (username.length <= 4) {
      return res
        .status(422)
        .send({ error: "Password should be at least 5 characters long!" });
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await UserModel.create({
      username: username,
      password: passwordHashed,
    });

    req.session.userId = newUser._id.toString();

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  username?: string;
  password?: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const rawPassword = req.body.password;

  try {
    if (!username || !rawPassword) {
      return res.status(400).send({ error: "Parameters missing" });
    }

    const user = await UserModel.findOne({ username: username })
      .select("+password +email")
      .exec();

    if (!user) {
      return res.status(400).send({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(rawPassword, user.password);

    if (!passwordMatch) {
      return res.status(400).send({ error: "Invalid credentials" });
    }

    req.session.userId = user._id.toString();
    const { password, ...respUser } = user.toObject();

    res.status(201).json(respUser);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};
