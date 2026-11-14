import data from '../data/site.json';
import { isMediaPath, resolveFile } from './media';

/** Site settings (edited in /admin → Site settings), with the resume path resolved if it was uploaded via the CMS. */
export const site = {
  ...data,
  resume: isMediaPath(data.resume) ? (resolveFile(data.resume) ?? data.resume) : data.resume,
};
export default site;
