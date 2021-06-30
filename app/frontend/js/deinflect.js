/*
  10ten Japanese Reader
  by Brian Birtles
  https://github.com/birchill/10ten-ja-reader
  ---
  Originally based on Rikaikun
  by Erek Speed
  http://code.google.com/p/rikaikun/
  ---
  Originally based on Rikaichan 1.07
  by Jonathan Zarate
  http://www.polarcloud.com/
  ---
  Originally based on RikaiXUL 0.4 by Todd Rudick
  http://www.rikai.com/
  http://rikaixul.mozdev.org/
  ---
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  You should have received a copy of the GNU General Public License
  along with this program. If not, see <https://www.gnu.org/licenses/>.
  ---
  Please do not change or remove any of the copyrights or links to web pages
  when modifying any of the files. - Jon
*/










"use strict";



export const WordType = {
    IchidanVerb: 1 << 0, // i.e. ru-verbs
    GodanVerb: 1 << 1, // i.e. u-verbs
    IAdj: 1 << 2, 
    KuruVerb: 1 << 3,
    SuruVerb: 1 << 4,
    NounVS: 1 << 5,
}
export const deinflectionKeys = {
    [0 /* PolitePastNegative */]: 'polite past negative',
    [1 /* PoliteNegative */]: 'polite negative',
    [2 /* PoliteVolitional */]: 'polite volitional',
    [3 /* Chau */]: 'chau',
    [4 /* Sugiru */]: 'sugiru',
    [5 /* Nasai */]: 'nasai',
    [6 /* PolitePast */]: 'polite past',
    [7 /* Tara */]: 'tara',
    [8 /* Tari */]: 'tari',
    [9 /* Causative */]: 'causative',
    [10 /* PotentialOrPassive */]: 'potential or passive',
    [12 /* Sou */]: 'sou',
    [11 /* Toku */]: 'toku',
    [13 /* Tai */]: 'tai',
    [14 /* Polite */]: 'polite',
    [15 /* Past */]: 'past',
    [16 /* Negative */]: 'negative',
    [17 /* Passive */]: 'passive',
    [18 /* Ba */]: 'ba',
    [19 /* Volitional */]: 'volitional',
    [20 /* Potential */]: 'potential',
    [21 /* CausativePassive */]: 'causative passive',
    [22 /* Te */]: 'te',
    [23 /* Zu */]: 'zu',
    [24 /* Imperative */]: 'imperative',
    [25 /* MasuStem */]: 'masu stem',
    [26 /* Adv */]: 'adv',
    [27 /* Noun */]: 'noun',
    [28 /* ImperativeNegative */]: 'imperative negative',
    [29 /* Continuous */]: 'continuous',
    [30 /* Ki */]: 'ki',
    [31 /* SuruNoun */]: 'suru noun',
    [32 /* SuruNoun */]: 'continuous いく',
};

//type is shifted << 8 (e.g. 640 == 2 == GodanVerb: 1 << 1)
const deinflectRuleData = [
    [
        'いらっしゃいませんでした',
        'いらっしゃる',
        640,
        0 /* PolitePastNegative */,
    ],
    [
        'おっしゃいませんでした',
        'おっしゃる',
        640,
        0 /* PolitePastNegative */,
    ],
    ['いらっしゃいました', 'いらっしゃる', 640, 6 /* PolitePast */],
    ['くありませんでした', 'い', 1152, 0 /* PolitePastNegative */],
    ['いらっしゃいます', 'いらっしゃる', 640, 14 /* Polite */],
    ['おっしゃいました', 'おっしゃる', 640, 6 /* PolitePast */],
    ['仰いませんでした', '仰る', 640, 0 /* PolitePastNegative */],
    ['いませんでした', 'う', 640, 0 /* PolitePastNegative */],
    ['おっしゃいます', 'おっしゃる', 640, 14 /* Polite */],
    ['きませんでした', 'く', 640, 0 /* PolitePastNegative */],
    ['きませんでした', 'くる', 2176, 0 /* PolitePastNegative */],
    ['ぎませんでした', 'ぐ', 640, 0 /* PolitePastNegative */],
    ['しませんでした', 'す', 640, 0 /* PolitePastNegative */],
    ['しませんでした', 'する', 4224, 0 /* PolitePastNegative */],
    ['しませんでした', 'す', 4224, 0 /* PolitePastNegative */],
    ['ちませんでした', 'つ', 640, 0 /* PolitePastNegative */],
    ['にませんでした', 'ぬ', 640, 0 /* PolitePastNegative */],
    ['びませんでした', 'ぶ', 640, 0 /* PolitePastNegative */],
    ['みませんでした', 'む', 640, 0 /* PolitePastNegative */],
    ['りませんでした', 'る', 640, 0 /* PolitePastNegative */],
    ['いらっしゃい', 'いらっしゃる', 640, 25 /* MasuStem */],
    ['いらっしゃい', 'いらっしゃる', 640, 24 /* Imperative */],
    ['くありません', 'い', 1152, 1 /* PoliteNegative */],
    ['ませんでした', 'る', 2432, 0 /* PolitePastNegative */],
    ['のたもうたら', 'のたまう', 640, 7 /* Tara */],
    ['のたもうたり', 'のたまう', 640, 8 /* Tari */],
    ['いましょう', 'う', 640, 2 /* PoliteVolitional */],
    ['仰いました', '仰る', 640, 6 /* PolitePast */],
    ['おっしゃい', 'おっしゃる', 640, 25 /* MasuStem */],
    ['おっしゃい', 'おっしゃる', 640, 24 /* Imperative */],
    ['きましょう', 'く', 640, 2 /* PoliteVolitional */],
    ['きましょう', 'くる', 2176, 2 /* PoliteVolitional */],
    ['ぎましょう', 'ぐ', 640, 2 /* PoliteVolitional */],
    ['しましょう', 'す', 640, 2 /* PoliteVolitional */],
    ['しましょう', 'する', 4224, 2 /* PoliteVolitional */],
    ['しましょう', 'す', 4224, 2 /* PoliteVolitional */],
    ['ちましょう', 'つ', 640, 2 /* PoliteVolitional */],
    ['にましょう', 'ぬ', 640, 2 /* PoliteVolitional */],
    ['のたもうた', 'のたまう', 640, 15 /* Past */],
    ['のたもうて', 'のたまう', 640, 22 /* Te */],
    ['びましょう', 'ぶ', 640, 2 /* PoliteVolitional */],
    ['みましょう', 'む', 640, 2 /* PoliteVolitional */],
    ['りましょう', 'る', 640, 2 /* PoliteVolitional */],
    ['いじゃう', 'ぐ', 514, 3 /* Chau */],
    ['いすぎる', 'う', 513, 4 /* Sugiru */],
    ['いちゃう', 'く', 514, 3 /* Chau */],
    ['いったら', 'いく', 640, 7 /* Tara */],
    ['いったり', 'いく', 640, 8 /* Tari */],
    ['いている', 'く', 513, 29 /* Continuous */],
    ['いでいる', 'ぐ', 513, 29 /* Continuous */],
    ['いなさい', 'う', 640, 5 /* Nasai */],
    ['いました', 'う', 640, 6 /* PolitePast */],
    ['いません', 'う', 640, 1 /* PoliteNegative */],
    ['おうたら', 'おう', 640, 7 /* Tara */],
    ['おうたり', 'おう', 640, 8 /* Tari */],
    ['仰います', '仰る', 640, 14 /* Polite */],
    ['かされる', 'く', 513, 21 /* CausativePassive */],
    ['かったら', 'い', 1152, 7 /* Tara */],
    ['かったり', 'い', 1152, 8 /* Tari */],
    ['がされる', 'ぐ', 513, 21 /* CausativePassive */],
    ['きすぎる', 'く', 513, 4 /* Sugiru */],
    ['きすぎる', 'くる', 2049, 4 /* Sugiru */],
    ['ぎすぎる', 'ぐ', 513, 4 /* Sugiru */],
    ['きちゃう', 'くる', 2050, 3 /* Chau */],
    ['きている', 'くる', 2049, 29 /* Continuous */],
    ['きなさい', 'く', 640, 5 /* Nasai */],
    ['きなさい', 'くる', 2176, 5 /* Nasai */],
    ['ぎなさい', 'ぐ', 640, 5 /* Nasai */],
    ['きました', 'く', 640, 6 /* PolitePast */],
    ['きました', 'くる', 2176, 6 /* PolitePast */],
    ['ぎました', 'ぐ', 640, 6 /* PolitePast */],
    ['きません', 'く', 640, 1 /* PoliteNegative */],
    ['きません', 'くる', 2176, 1 /* PoliteNegative */],
    ['ぎません', 'ぐ', 640, 1 /* PoliteNegative */],
    ['こうたら', 'こう', 640, 7 /* Tara */],
    ['こうたり', 'こう', 640, 8 /* Tari */],
    ['こさせる', 'くる', 2049, 9 /* Causative */],
    ['こられる', 'くる', 2049, 10 /* PotentialOrPassive */],
    ['しすぎる', 'す', 4609, 4 /* Sugiru */],
    ['しすぎる', 'する', 4097, 4 /* Sugiru */],
    ['しちゃう', 'す', 4610, 3 /* Chau */],
    ['しちゃう', 'する', 4098, 3 /* Chau */],
    ['している', 'す', 4609, 29 /* Continuous */],
    ['している', 'する', 4097, 29 /* Continuous */],
    ['しなさい', 'す', 4736, 5 /* Nasai */],
    ['しなさい', 'する', 4224, 5 /* Nasai */],
    ['しました', 'す', 4736, 6 /* PolitePast */],
    ['しました', 'する', 4224, 6 /* PolitePast */],
    ['しません', 'す', 4736, 1 /* PoliteNegative */],
    ['しません', 'する', 4224, 1 /* PoliteNegative */],
    ['そうたら', 'そう', 640, 7 /* Tara */],
    ['そうたり', 'そう', 640, 8 /* Tari */],
    ['たされる', 'つ', 513, 21 /* CausativePassive */],
    ['ちすぎる', 'つ', 513, 4 /* Sugiru */],
    ['ちなさい', 'つ', 640, 5 /* Nasai */],
    ['ちました', 'つ', 640, 6 /* PolitePast */],
    ['ちません', 'つ', 640, 1 /* PoliteNegative */],
    ['っちゃう', 'う', 514, 3 /* Chau */],
    ['っちゃう', 'く', 514, 3 /* Chau */],
    ['っちゃう', 'つ', 514, 3 /* Chau */],
    ['っちゃう', 'る', 514, 3 /* Chau */],
    ['っている', 'う', 513, 29 /* Continuous */],
    ['っている', 'つ', 513, 29 /* Continuous */],
    ['っている', 'る', 513, 29 /* Continuous */],
    ['とうたら', 'とう', 640, 7 /* Tara */],
    ['とうたり', 'とう', 640, 8 /* Tari */],
    ['なされる', 'ぬ', 513, 21 /* CausativePassive */],
    ['にすぎる', 'ぬ', 513, 4 /* Sugiru */],
    ['になさい', 'ぬ', 640, 5 /* Nasai */],
    ['にました', 'ぬ', 640, 6 /* PolitePast */],
    ['にません', 'ぬ', 640, 1 /* PoliteNegative */],
    ['ばされる', 'ぶ', 513, 21 /* CausativePassive */],
    ['びすぎる', 'ぶ', 513, 4 /* Sugiru */],
    ['びなさい', 'ぶ', 640, 5 /* Nasai */],
    ['びました', 'ぶ', 640, 6 /* PolitePast */],
    ['びません', 'ぶ', 640, 1 /* PoliteNegative */],
    ['まされる', 'む', 513, 21 /* CausativePassive */],
    ['ましょう', 'る', 2432, 2 /* PoliteVolitional */],
    ['みすぎる', 'む', 513, 4 /* Sugiru */],
    ['みなさい', 'む', 640, 5 /* Nasai */],
    ['みました', 'む', 640, 6 /* PolitePast */],
    ['みません', 'む', 640, 1 /* PoliteNegative */],
    ['らされる', 'る', 513, 21 /* CausativePassive */],
    ['りすぎる', 'る', 513, 4 /* Sugiru */],
    ['りなさい', 'る', 640, 5 /* Nasai */],
    ['りました', 'る', 640, 6 /* PolitePast */],
    ['りません', 'る', 640, 1 /* PoliteNegative */],
    ['わされる', 'う', 513, 21 /* CausativePassive */],
    ['んじゃう', 'ぬ', 514, 3 /* Chau */],
    ['んじゃう', 'ぶ', 514, 3 /* Chau */],
    ['んじゃう', 'む', 514, 3 /* Chau */],
    ['んでいる', 'ぬ', 513, 29 /* Continuous */],
    ['んでいる', 'ぶ', 513, 29 /* Continuous */],
    ['んでいる', 'む', 513, 29 /* Continuous */],
    ['行ったら', '行く', 640, 7 /* Tara */],
    ['行ったり', '行く', 640, 8 /* Tari */],
    ['逝ったら', '逝く', 640, 7 /* Tara */],
    ['逝ったり', '逝く', 640, 8 /* Tari */],
    ['往ったら', '往く', 640, 7 /* Tara */],
    ['往ったり', '往く', 640, 8 /* Tari */],
    ['逝ったら', '逝く', 640, 7 /* Tara */],
    ['逝ったり', '逝く', 640, 8 /* Tari */],
    ['往ったら', '往く', 640, 7 /* Tara */],
    ['往ったり', '往く', 640, 8 /* Tari */],
    ['請うたら', '請う', 640, 7 /* Tara */],
    ['請うたり', '請う', 640, 8 /* Tari */],
    ['乞うたら', '乞う', 640, 7 /* Tara */],
    ['乞うたり', '乞う', 640, 8 /* Tari */],
    ['恋うたら', '恋う', 640, 7 /* Tara */],
    ['恋うたり', '恋う', 640, 8 /* Tari */],
    ['来させる', '来る', 2049, 9 /* Causative */],
    ['來させる', '來る', 2049, 9 /* Causative */],
    ['来ました', '来る', 2176, 6 /* PolitePast */],
    ['来ません', '来る', 2176, 1 /* PoliteNegative */],
    ['來ました', '來る', 2176, 6 /* PolitePast */],
    ['來ません', '來る', 2176, 1 /* PoliteNegative */],
    ['来られる', '来る', 2049, 10 /* PotentialOrPassive */],
    ['來られる', '來る', 2049, 10 /* PotentialOrPassive */],
    ['問うたら', '問う', 640, 7 /* Tara */],
    ['問うたり', '問う', 640, 8 /* Tari */],
    ['負うたら', '負う', 640, 7 /* Tara */],
    ['負うたり', '負う', 640, 8 /* Tari */],
    ['沿うたら', '沿う', 640, 7 /* Tara */],
    ['沿うたり', '沿う', 640, 8 /* Tari */],
    ['添うたら', '添う', 640, 7 /* Tara */],
    ['添うたり', '添う', 640, 8 /* Tari */],
    ['副うたら', '副う', 640, 7 /* Tara */],
    ['副うたり', '副う', 640, 8 /* Tari */],
    ['厭うたら', '厭う', 640, 7 /* Tara */],
    ['厭うたり', '厭う', 640, 8 /* Tari */],
    ['いそう', 'う', 640, 12 /* Sou */],
    ['いたい', 'う', 516, 13 /* Tai */],
    ['いたら', 'く', 640, 7 /* Tara */],
    ['いだら', 'ぐ', 640, 7 /* Tara */],
    ['いたり', 'く', 640, 8 /* Tari */],
    ['いだり', 'ぐ', 640, 8 /* Tari */],
    ['いった', 'いく', 640, 15 /* Past */],
    ['いって', 'いく', 640, 22 /* Te */],
    ['いてる', 'く', 513, 29 /* Continuous */],
    ['いでる', 'ぐ', 513, 29 /* Continuous */],
    ['いとく', 'く', 514, 11 /* Toku */],
    ['いどく', 'ぐ', 514, 11 /* Toku */],
    ['います', 'う', 640, 14 /* Polite */],
    ['おうた', 'おう', 640, 15 /* Past */],
    ['おうて', 'おう', 640, 22 /* Te */],
    ['かせる', 'く', 513, 9 /* Causative */],
    ['がせる', 'ぐ', 513, 9 /* Causative */],
    ['かった', 'い', 1152, 15 /* Past */],
    ['かない', 'く', 516, 16 /* Negative */],
    ['がない', 'ぐ', 516, 16 /* Negative */],
    ['かれる', 'く', 513, 17 /* Passive */],
    ['がれる', 'ぐ', 513, 17 /* Passive */],
    ['きそう', 'く', 640, 12 /* Sou */],
    ['きそう', 'くる', 2176, 12 /* Sou */],
    ['ぎそう', 'ぐ', 640, 12 /* Sou */],
    ['きたい', 'く', 516, 13 /* Tai */],
    ['きたい', 'くる', 2052, 13 /* Tai */],
    ['ぎたい', 'ぐ', 516, 13 /* Tai */],
    ['きたら', 'くる', 2176, 7 /* Tara */],
    ['きたり', 'くる', 2176, 8 /* Tari */],
    ['きてる', 'くる', 2049, 29 /* Continuous */],
    ['きとく', 'くる', 2050, 11 /* Toku */],
    ['きます', 'く', 640, 14 /* Polite */],
    ['きます', 'くる', 2176, 14 /* Polite */],
    ['ぎます', 'ぐ', 640, 14 /* Polite */],
    ['くない', 'い', 1028, 16 /* Negative */],
    ['ければ', 'い', 1152, 18 /* Ba */],
    ['こうた', 'こう', 640, 15 /* Past */],
    ['こうて', 'こう', 640, 22 /* Te */],
    ['こない', 'くる', 2052, 16 /* Negative */],
    ['こよう', 'くる', 2176, 19 /* Volitional */],
    ['これる', 'くる', 2049, 20 /* Potential */],
    ['来れる', '来る', 2049, 20 /* Potential */],
    ['來れる', '來る', 2049, 20 /* Potential */],
    ['させる', 'する', 4097, 9 /* Causative */],
    ['させる', 'る', 257, 9 /* Causative */],
    ['させる', 'す', 4609, 9 /* Causative */],
    ['さない', 'す', 516, 16 /* Negative */],
    ['される', 'す', 4609, 17 /* Passive */],
    ['される', 'する', 4097, 17 /* Passive */],
    ['しそう', 'す', 4736, 12 /* Sou */],
    ['しそう', 'する', 4224, 12 /* Sou */],
    ['したい', 'す', 4612, 13 /* Tai */],
    ['したい', 'する', 4100, 13 /* Tai */],
    ['したら', 'す', 4736, 7 /* Tara */],
    ['したら', 'する', 4224, 7 /* Tara */],
    ['したり', 'す', 4736, 8 /* Tari */],
    ['したり', 'する', 4224, 8 /* Tari */],
    ['してる', 'す', 4609, 29 /* Continuous */],
    ['してる', 'する', 4097, 29 /* Continuous */],
    ['しとく', 'す', 4610, 11 /* Toku */],
    ['しとく', 'する', 4098, 11 /* Toku */],
    ['しない', 'する', 4100, 16 /* Negative */],
    ['します', 'す', 4736, 14 /* Polite */],
    ['します', 'する', 4224, 14 /* Polite */],
    ['しよう', 'する', 4224, 19 /* Volitional */],
    ['すぎる', 'い', 1025, 4 /* Sugiru */],
    ['すぎる', 'る', 2305, 4 /* Sugiru */],
    ['そうた', 'そう', 640, 15 /* Past */],
    ['そうて', 'そう', 640, 22 /* Te */],
    ['たせる', 'つ', 513, 9 /* Causative */],
    ['たない', 'つ', 516, 16 /* Negative */],
    ['たれる', 'つ', 513, 17 /* Passive */],
    ['ちそう', 'つ', 640, 12 /* Sou */],
    ['ちたい', 'つ', 516, 13 /* Tai */],
    ['ちます', 'つ', 640, 14 /* Polite */],
    ['ちゃう', 'る', 2306, 3 /* Chau */],
    ['ったら', 'う', 640, 7 /* Tara */],
    ['ったら', 'つ', 640, 7 /* Tara */],
    ['ったら', 'る', 640, 7 /* Tara */],
    ['ったり', 'う', 640, 8 /* Tari */],
    ['ったり', 'つ', 640, 8 /* Tari */],
    ['ったり', 'る', 640, 8 /* Tari */],
    ['ってる', 'う', 513, 29 /* Continuous */],
    ['ってる', 'つ', 513, 29 /* Continuous */],
    ['ってる', 'る', 513, 29 /* Continuous */],
    ['っとく', 'う', 514, 11 /* Toku */],
    ['っとく', 'つ', 514, 11 /* Toku */],
    ['っとく', 'る', 514, 11 /* Toku */],
    ['ている', 'る', 2305, 29 /* Continuous */],
    ['とうた', 'とう', 640, 15 /* Past */],
    ['とうて', 'とう', 640, 22 /* Te */],
    ['なさい', 'る', 2432, 5 /* Nasai */],
    ['なせる', 'ぬ', 513, 9 /* Causative */],
    ['なない', 'ぬ', 516, 16 /* Negative */],
    ['なれる', 'ぬ', 513, 17 /* Passive */],
    ['にそう', 'ぬ', 640, 12 /* Sou */],
    ['にたい', 'ぬ', 516, 13 /* Tai */],
    ['にます', 'ぬ', 640, 14 /* Polite */],
    ['ばせる', 'ぶ', 513, 9 /* Causative */],
    ['ばない', 'ぶ', 516, 16 /* Negative */],
    ['ばれる', 'ぶ', 513, 17 /* Passive */],
    ['びそう', 'ぶ', 640, 12 /* Sou */],
    ['びたい', 'ぶ', 516, 13 /* Tai */],
    ['びます', 'ぶ', 640, 14 /* Polite */],
    ['ました', 'る', 384, 6 /* PolitePast */],
    ['ませる', 'む', 513, 9 /* Causative */],
    ['ません', 'る', 384, 1 /* PoliteNegative */],
    ['まない', 'む', 516, 16 /* Negative */],
    ['まれる', 'む', 513, 17 /* Passive */],
    ['みそう', 'む', 640, 12 /* Sou */],
    ['みたい', 'む', 516, 13 /* Tai */],
    ['みます', 'む', 640, 14 /* Polite */],
    ['らせる', 'る', 513, 9 /* Causative */],
    ['らない', 'る', 516, 16 /* Negative */],
    ['られる', 'る', 2305, 10 /* PotentialOrPassive */],
    ['られる', 'る', 513, 17 /* Passive */],
    ['りそう', 'る', 640, 12 /* Sou */],
    ['りたい', 'る', 516, 13 /* Tai */],
    ['ります', 'る', 640, 14 /* Polite */],
    ['わせる', 'う', 513, 9 /* Causative */],
    ['わない', 'う', 516, 16 /* Negative */],
    ['われる', 'う', 513, 17 /* Passive */],
    ['んだら', 'ぬ', 640, 7 /* Tara */],
    ['んだら', 'ぶ', 640, 7 /* Tara */],
    ['んだら', 'む', 640, 7 /* Tara */],
    ['んだり', 'ぬ', 640, 8 /* Tari */],
    ['んだり', 'ぶ', 640, 8 /* Tari */],
    ['んだり', 'む', 640, 8 /* Tari */],
    ['んでる', 'ぬ', 513, 29 /* Continuous */],
    ['んでる', 'ぶ', 513, 29 /* Continuous */],
    ['んでる', 'む', 513, 29 /* Continuous */],
    ['んどく', 'ぬ', 514, 11 /* Toku */],
    ['んどく', 'ぶ', 514, 11 /* Toku */],
    ['んどく', 'む', 514, 11 /* Toku */],
    ['行った', '行く', 640, 15 /* Past */],
    ['行って', '行く', 640, 22 /* Te */],
    ['逝った', '逝く', 640, 15 /* Past */],
    ['逝って', '逝く', 640, 22 /* Te */],
    ['往った', '往く', 640, 15 /* Past */],
    ['往って', '往く', 640, 22 /* Te */],
    ['請うた', '請う', 640, 15 /* Past */],
    ['請うて', '請う', 640, 22 /* Te */],
    ['乞うた', '乞う', 640, 15 /* Past */],
    ['乞うて', '乞う', 640, 22 /* Te */],
    ['恋うた', '恋う', 640, 15 /* Past */],
    ['恋うて', '恋う', 640, 22 /* Te */],
    ['問うた', '問う', 640, 15 /* Past */],
    ['問うて', '問う', 640, 22 /* Te */],
    ['負うた', '負う', 640, 15 /* Past */],
    ['負うて', '負う', 640, 22 /* Te */],
    ['沿うた', '沿う', 640, 15 /* Past */],
    ['沿うて', '沿う', 640, 22 /* Te */],
    ['添うた', '添う', 640, 15 /* Past */],
    ['添うて', '添う', 640, 22 /* Te */],
    ['副うた', '副う', 640, 15 /* Past */],
    ['副うて', '副う', 640, 22 /* Te */],
    ['厭うた', '厭う', 640, 15 /* Past */],
    ['厭うて', '厭う', 640, 22 /* Te */],
    ['いた', 'く', 640, 15 /* Past */],
    ['いだ', 'ぐ', 640, 15 /* Past */],
    ['いて', 'く', 640, 22 /* Te */],
    ['いで', 'ぐ', 640, 22 /* Te */],
    ['えば', 'う', 640, 18 /* Ba */],
    ['える', 'う', 513, 20 /* Potential */],
    ['おう', 'う', 640, 19 /* Volitional */],
    ['仰い', '仰る', 640, 25 /* MasuStem */],
    ['仰い', '仰る', 640, 24 /* Imperative */],
    ['かず', 'く', 640, 23 /* Zu */],
    ['がず', 'ぐ', 640, 23 /* Zu */],
    ['かぬ', 'く', 640, 16 /* Negative */],
    ['かん', 'く', 640, 16 /* Negative */],
    ['がぬ', 'ぐ', 640, 16 /* Negative */],
    ['がん', 'ぐ', 640, 16 /* Negative */],
    ['きた', 'くる', 2176, 15 /* Past */],
    ['きて', 'くる', 2176, 22 /* Te */],
    ['くて', 'い', 1152, 22 /* Te */],
    ['けば', 'く', 640, 18 /* Ba */],
    ['げば', 'ぐ', 640, 18 /* Ba */],
    ['ける', 'く', 513, 20 /* Potential */],
    ['げる', 'ぐ', 513, 20 /* Potential */],
    ['こい', 'くる', 2176, 24 /* Imperative */],
    ['こう', 'く', 640, 19 /* Volitional */],
    ['ごう', 'ぐ', 640, 19 /* Volitional */],
    ['こず', 'くる', 2176, 23 /* Zu */],
    ['こぬ', 'くる', 2176, 16 /* Negative */],
    ['こん', 'くる', 2176, 16 /* Negative */],
    ['さず', 'す', 640, 23 /* Zu */],
    ['さぬ', 'す', 640, 16 /* Negative */],
    ['さん', 'す', 640, 16 /* Negative */],
    ['した', 'す', 4736, 15 /* Past */],
    ['した', 'する', 4224, 15 /* Past */],
    ['して', 'す', 4736, 22 /* Te */],
    ['して', 'する', 4224, 22 /* Te */],
    ['しろ', 'す', 4224, 24 /* Imperative */],
    ['しろ', 'する', 4224, 24 /* Imperative */],
    ['せず', 'する', 4224, 23 /* Zu */],
    ['せぬ', 'する', 4224, 16 /* Negative */],
    ['せん', 'する', 4224, 16 /* Negative */],
    ['せず', 'す', 4224, 23 /* Zu */],
    ['せぬ', 'す', 4224, 16 /* Negative */],
    ['せん', 'す', 4224, 16 /* Negative */],
    ['せば', 'す', 4736, 18 /* Ba */],
    ['せよ', 'する', 4224, 24 /* Imperative */],
    ['せよ', 'す', 4224, 24 /* Imperative */],
    ['せる', 'す', 513, 20 /* Potential */],
    ['そう', 'い', 1152, 12 /* Sou */],
    ['そう', 'す', 640, 19 /* Volitional */],
    ['そう', 'る', 2432, 12 /* Sou */],
    ['たい', 'る', 2308, 13 /* Tai */],
    ['たず', 'つ', 640, 23 /* Zu */],
    ['たぬ', 'つ', 640, 16 /* Negative */],
    ['たん', 'つ', 640, 16 /* Negative */],
    ['たら', 'る', 2432, 7 /* Tara */],
    ['たり', 'る', 2432, 8 /* Tari */],
    ['った', 'う', 640, 15 /* Past */],
    ['った', 'つ', 640, 15 /* Past */],
    ['った', 'る', 640, 15 /* Past */],
    ['って', 'う', 640, 22 /* Te */],
    ['って', 'つ', 640, 22 /* Te */],
    ['って', 'る', 640, 22 /* Te */],
    ['てば', 'つ', 640, 18 /* Ba */],
    ['てる', 'つ', 513, 20 /* Potential */],
    ['てる', 'る', 2305, 29 /* Continuous */],
    ['とう', 'つ', 640, 19 /* Volitional */],
    ['とく', 'る', 2306, 11 /* Toku */],
    ['ない', 'る', 2308, 16 /* Negative */],
    ['なず', 'ぬ', 640, 23 /* Zu */],
    ['なぬ', 'ぬ', 640, 16 /* Negative */],
    ['なん', 'ぬ', 640, 16 /* Negative */],
    ['ねば', 'ぬ', 640, 18 /* Ba */],
    ['ねる', 'ぬ', 513, 20 /* Potential */],
    ['のう', 'ぬ', 640, 19 /* Volitional */],
    ['ばず', 'ぶ', 640, 23 /* Zu */],
    ['ばぬ', 'ぶ', 640, 16 /* Negative */],
    ['ばん', 'ぶ', 640, 16 /* Negative */],
    ['べば', 'ぶ', 640, 18 /* Ba */],
    ['べる', 'ぶ', 513, 20 /* Potential */],
    ['ぼう', 'ぶ', 640, 19 /* Volitional */],
    ['ます', 'る', 2432, 14 /* Polite */],
    ['まず', 'む', 640, 23 /* Zu */],
    ['まぬ', 'む', 640, 16 /* Negative */],
    ['まん', 'む', 640, 16 /* Negative */],
    ['めば', 'む', 640, 18 /* Ba */],
    ['める', 'む', 513, 20 /* Potential */],
    ['もう', 'む', 640, 19 /* Volitional */],
    ['よう', 'る', 2432, 19 /* Volitional */],
    ['らず', 'る', 640, 23 /* Zu */],
    ['らぬ', 'る', 640, 16 /* Negative */],
    ['らん', 'る', 640, 16 /* Negative */],
    ['れば', 'る', 7040, 18 /* Ba */],
    ['れる', 'る', 769, 20 /* Potential */],
    ['ろう', 'る', 640, 19 /* Volitional */],
    ['わず', 'う', 640, 23 /* Zu */],
    ['わぬ', 'う', 640, 16 /* Negative */],
    ['わん', 'う', 640, 16 /* Negative */],
    ['んだ', 'ぬ', 640, 15 /* Past */],
    ['んだ', 'ぶ', 640, 15 /* Past */],
    ['んだ', 'む', 640, 15 /* Past */],
    ['んで', 'ぬ', 640, 22 /* Te */],
    ['んで', 'ぶ', 640, 22 /* Te */],
    ['んで', 'む', 640, 22 /* Te */],
    ['い', 'いる', 384, 25 /* MasuStem */],
    ['い', 'う', 640, 25 /* MasuStem */],
    ['い', 'る', 2176, 24 /* Imperative */],
    ['え', 'う', 640, 24 /* Imperative */],
    ['え', 'える', 384, 25 /* MasuStem */],
    ['き', 'きる', 384, 25 /* MasuStem */],
    ['き', 'く', 640, 25 /* MasuStem */],
    ['き', 'くる', 2176, 25 /* MasuStem */],
    ['ぎ', 'ぎる', 384, 25 /* MasuStem */],
    ['ぎ', 'ぐ', 640, 25 /* MasuStem */],
    ['き', 'い', 1152, 30 /* Ki */],
    ['く', 'い', 1152, 26 /* Adv */],
    ['け', 'く', 640, 24 /* Imperative */],
    ['け', 'ける', 384, 25 /* MasuStem */],
    ['げ', 'ぐ', 640, 24 /* Imperative */],
    ['げ', 'げる', 384, 25 /* MasuStem */],
    ['さ', 'い', 1152, 27 /* Noun */],
    ['し', 'す', 640, 25 /* MasuStem */],
    ['じ', 'じる', 384, 25 /* MasuStem */],
    ['ず', 'る', 2432, 23 /* Zu */],
    ['せ', 'す', 640, 24 /* Imperative */],
    ['せ', 'せる', 384, 25 /* MasuStem */],
    ['ぜ', 'ぜる', 384, 25 /* MasuStem */],
    ['た', 'る', 2432, 15 /* Past */],
    ['ち', 'ちる', 384, 25 /* MasuStem */],
    ['ち', 'つ', 640, 25 /* MasuStem */],
    ['て', 'つ', 640, 24 /* Imperative */],
    ['て', 'てる', 384, 25 /* MasuStem */],
    ['て', 'る', 2432, 22 /* Te */],
    ['で', 'でる', 384, 25 /* MasuStem */],
    ['な', '', 7040, 28 /* ImperativeNegative */],
    ['に', 'にる', 384, 25 /* MasuStem */],
    ['に', 'ぬ', 640, 25 /* MasuStem */],
    ['ぬ', 'る', 384, 16 /* Negative */],
    ['ん', 'る', 384, 16 /* Negative */],
    ['ね', 'ぬ', 640, 24 /* Imperative */],
    ['ね', 'ねる', 384, 25 /* MasuStem */],
    ['ひ', 'ひる', 384, 25 /* MasuStem */],
    ['び', 'びる', 384, 25 /* MasuStem */],
    ['び', 'ぶ', 640, 25 /* MasuStem */],
    ['へ', 'へる', 384, 25 /* MasuStem */],
    ['べ', 'ぶ', 640, 24 /* Imperative */],
    ['べ', 'べる', 384, 25 /* MasuStem */],
    ['み', 'みる', 384, 25 /* MasuStem */],
    ['み', 'む', 640, 25 /* MasuStem */],
    ['め', 'む', 640, 24 /* Imperative */],
    ['め', 'める', 384, 25 /* MasuStem */],
    ['よ', 'る', 384, 24 /* Imperative */],
    ['り', 'りる', 384, 25 /* MasuStem */],
    ['り', 'る', 640, 25 /* MasuStem */],
    ['れ', 'る', 640, 24 /* Imperative */],
    ['れ', 'れる', 384, 25 /* MasuStem */],
    ['ろ', 'る', 384, 24 /* Imperative */],
    ['する', '', 8208, 31 /* SuruNoun */],

    //['っていく', 'う', 513, 32 /* Continuous いく*/],
    //['っていく', 'つ', 513, 32 /* Continuous いく*/],
    //['っていく', 'る', 513, 32 /* Continuous いく*/],
    //['んでいく', 'ぬ', 513, 32 /* Continuous いく*/],
    //['んでいく', 'ぶ', 513, 32 /* Continuous いく*/],
    //['んでいく', 'む', 513, 32 /* Continuous いく*/],
    //['いていく', 'く', 513, 32 /* Continuous いく*/],
    //['いでいく', 'ぐ', 513, 32 /* Continuous いく*/],
    //['していく', 'す', 4609, 32 /* Continuous いく*/],
    //['していく', 'する', 4097, 32 /* Continuous いく*/],
    //['ていく', 'る', 2432, 32 /* Continuous いく*/],

];
const deinflectRuleGroups = [];
function getDeinflectRuleGroups() {
    if (!deinflectRuleGroups.length) {
        let prevLen = -1;
        let ruleGroup;
        for (const [from, to, type, reason] of deinflectRuleData) {
            const rule = { from, to, type, reason };
            if (prevLen !== rule.from.length) {
                prevLen = rule.from.length;
                ruleGroup = { rules: [], fromLen: prevLen };
                deinflectRuleGroups.push(ruleGroup);
            }
            ruleGroup.rules.push(rule);
        }
    }
    return deinflectRuleGroups;
}
// Returns an array of possible de-inflected versions of |word|.
export function deinflect(word) {
    const result = [];
    const resultIndex = {};
    const ruleGroups = getDeinflectRuleGroups();
    const original = {
        word,
        // Initially we don't know what type of word we have so we set the type
        // mask to match all rules.
        type: 0xff,
        reasons: [],
    };
    result.push(original);
    resultIndex[word] = 0;
    let i = 0;
    do {
        const thisCandidate = result[i];
        // Don't deinflect masu-stem results any further since they should already
        // be the plain form.
        //
        // Without this we would take something like 食べて, try deinflecting it as
        // a masu stem into 食べてる and then try de-inflecting it as a continuous
        // form. However, we should just stop immediately after de-inflecting to
        // the plain form.
        if (thisCandidate.reasons.length === 1 &&
            thisCandidate.reasons[0].length === 1 &&
            thisCandidate.reasons[0][0] === 25 /* MasuStem */) {
            continue;
        }
        const word = thisCandidate.word;
        const type = thisCandidate.type;
        for (const ruleGroup of ruleGroups) {
            if (ruleGroup.fromLen <= word.length) {
                const ending = word.substr(-ruleGroup.fromLen);
                for (const rule of ruleGroup.rules) {
                    if (type & rule.type && ending === rule.from) {
                        const newWord = word.substr(0, word.length - rule.from.length) + rule.to;
                        if (newWord.length <= 1) {
                            continue;
                        }
                        // If we already have a candidate for this word with the same
                        // to type(s), expand the possible reasons.
                        //
                        // If the to type(s) differ, then we'll add a separate candidate
                        // and just hope that when we go to match against dictionary words
                        // we'll filter out the mismatching one(s).
                        if (resultIndex[newWord]) {
                            const candidate = result[resultIndex[newWord]];
                            if (candidate.type === rule.type >> 8) {
                                candidate.reasons.unshift([rule.reason]);
                                continue;
                            }
                        }
                        resultIndex[newWord] = result.length;
                        // Deep clone multidimensional array
                        const reasons = [];
                        for (const array of thisCandidate.reasons) {
                            reasons.push(Array.from(array));
                        }
                        if (reasons.length) {
                            const firstReason = reasons[0];
                            // This is a bit hacky but the alternative is to add the
                            // full-form causative passive inflections to the deinflection
                            // dictionary and then try to merge the results.
                            if (rule.reason === 9 /* Causative */ &&
                                firstReason.length &&
                                firstReason[0] === 10 /* PotentialOrPassive */) {
                                firstReason.splice(0, 1, 21 /* CausativePassive */);
                            }
                            else {
                                firstReason.unshift(rule.reason);
                            }
                        }
                        else {
                            reasons.push([rule.reason]);
                        }
                        const candidate = {
                            reasons,
                            type: rule.type >> 8,
                            word: newWord,
                        };
                        result.push(candidate);
                    }
                }
            }
        }
    } while (++i < result.length);
    return result;
}
