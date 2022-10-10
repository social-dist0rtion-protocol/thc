import { ethers } from "ethers";

import { langEs as es } from "@ethersproject/wordlists/lib/lang-es";
import { langFr as fr } from "@ethersproject/wordlists/lib/lang-fr";
import {
  langZhCn as zh_cn,
  langZhTw as zh_tw,
} from "@ethersproject/wordlists/lib/lang-zh";

ethers.wordlists.es = es;
ethers.wordlists.fr = fr;
ethers.wordlists.zh = zh_cn;
ethers.wordlists.zh_cn = zh_cn;
ethers.wordlists.zh_tw = zh_tw;
