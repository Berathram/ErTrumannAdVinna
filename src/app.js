import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  getDayType, getNextVacation, getNextWork, isWorking,
} from './schedule.js';

const app = express();

dotenv.config();

const {
  PORT: port = 3000,
} = process.env;
app.use(express.urlencoded({ extended: true }));
const viewsPath = `${dirname(fileURLToPath(import.meta.url))}\\..\\views`;
app.set('views', viewsPath);
app.set('view engine', 'ejs');
const staticPath = `${dirname(fileURLToPath(import.meta.url))}\\..\\public`;
app.use(express.static(staticPath));

function handle(req, res) {
  const now = new Date();
  let answer = '';
  let next = '';
  let desc = '';
  if (isWorking(now)) {
    answer = 'Já';
    ({ next, desc } = handleIsWorking(now));
  } else {
    answer = 'Nei';
    ({ next, desc } = handleIsNotWorking(now));
  }
  const data = {
    title: 'Er Trúmann að vinna?',
    answer,
    desc,
    next,
  };
  return res.render('main', data);
}

function handleIsWorking(now) {
  const next = `Hann kemst næst í frí ${formatDate(getNextVacation(now))}`;
  let desc = '';
  const dayType = getDayType(now);
  if (dayType === 1) {
    desc = 'Í dag er dagvakt (7:30 - 19:30)';
  }
  if (dayType === 2) {
    desc = 'I dag er næturvakt (19:30 - 7:30)';
  }
  if (dayType === 0) {
    desc = 'I dag er næturvakt til 7:30';
  }
  return { desc, next };
}

function handleIsNotWorking(now) {
  let next = '';
  let desc = '';
  const dayType = getDayType(now);
  if (dayType === 0) {
    desc = 'Hann er í fríi í dag';
    next = `Hann fer næst í vinnuna ${formatDate(getNextWork(now))}`;
    return { desc, next };
  }
  next = `Hann kemst næst í frí ${formatDate(getNextVacation(now))}`;
  if (dayType === 1) {
    desc = 'Í dag er dagvakt (7:30 - 19:30)';
  }
  if (dayType === 2) {
    desc = 'I dag er næturvakt  (19:30 - 7:30)';
  }
  return { desc, next };
}

function formatDate(dateInput) {
  const date = dateInput.toISOString();
  const day = date.substring(8, 10);
  const month = date.substring(5, 7);
  return `${day}.${month}`;
}

/**
 * Middleware sem sér um 404 villur.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @param {function} next Næsta middleware
 */
function notFoundHandler(req, res, next) { // eslint-disable-line
  const title = 'Fannst ekki';
  const message = 'Því miður fannst þessi síða ekki';
  res.status(404).render('error', { title, message });
}
/**
 * Middleware sem sér um villumeðhöndlun.
 *
 * @param {object} err Villa sem kom upp
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @param {function} next Næsta middleware
 */
function errorHandler(err, req, res, next) { // eslint-disable-line
  const title = 'Villa kom upp';
  const message = '';
  res.status(500).render('error', { title, message });
}

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});

app.get('/', handle);
app.use(notFoundHandler);
app.use(errorHandler);
