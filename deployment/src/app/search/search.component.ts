import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

import { environment } from "../../environments/environment";


const BACKEND_URL = environment.api;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  query: string;

  page = 1;

  content: any;

  itemData: any;
  itemArray: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private data: DataService,
    private rest: RestApiService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.query = res['query'];
      this.page = 1;
      // this.getItems();
      this.getItemsFuse();
    });
  }

  get lower() {
    return 1 + this.content.hitsPerPage * this.content.page;
  }

  get upper() {
    return Math.min(
      this.content.hitsPerPage * (this.content.page + 1),
      this.content.nbHits,
    );
  }

  async getItems() {
    this.content = null;
    try {
      const data = await this.rest.get(
        BACKEND_URL + `/search?query=${this.query}&page=${this.page -
        1}`,
      );
      data['success']
        ? (this.content = data['content'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  async getItemsFuse(event?: any) {
    if (event) {
      this.itemData = null;
    }
    try {
      const data = await this.rest.get(
        BACKEND_URL + `/itemsAll/?page=${this
          .page - 1}` ,
        //"http://wastenotcsulb-env.aewuadnmmg.us-east-1.elasticbeanstalk.com/api/items"
      );
      if (data['success']) {
        this.itemData = data;
        this.itemArray = this.itemData.items;
      } else {
        this.data.error(data['message']);
      }
      //console.log(this.itemData);
      //console.log(this.itemArray);

      this.fuseSearch();

    } catch (error) {
      this.data.error(error['message']);
    }
  }

  fuseSearch() {

    //console.log("333 fuse search called")
    var options = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        "title"
      ]
    };


    // let list: any[] = [{ "title": "pizza" }, { "title": "boxing" }];
    //let list: any[] = this.itemData.items;
    // console.log("alpha kenny you 123: " + this.itemData.items);
    //console.log("alpha kenny you 123: " + JSON.stringify(this.itemArray));
    let list: any[] = this.itemArray;

    let queryS: string = "my query";

    let fuseOpts: IFuseOptions = {
      //options
      threshold: 0.4,

      keys: ["title"]
    };
    //console.log("2222434 fuseResults");

    let fuseSearch = new Fuse(list, fuseOpts);
    let fuseResults: any[] = fuseSearch.search(this.query);
    //console.log("343434 fuseResults");
    //console.log(fuseResults);

    this.content = fuseResults;
  }
}



/**
 * typescript class
 * based on  Fuse - Lightweight fuzzy-search
 *
 * Copyright (c) 2012-2016 Kirollos Risk <kirollos@gmail.com>.
 * https://github.com/krisk/Fuse
 */

export class Fuse {
  private list: any[];
  private pattern: string;
  private results: any[];
  private resultMap: any;
  private _keyMap: any;

  private fullSeacher: any;
  private tokenSearchers: any;

  constructor(list: any[], private options?: IFuseOptions) {
    var i
    var len
    var key
    var keys

    this.list = list
    this.options = this.options || {}

    for (key in this.defaultOptions) {
      if (!this.defaultOptions.hasOwnProperty(key)) {
        continue;
      }
      // Add boolean type options
      if (typeof this.defaultOptions[key] === 'boolean') {
        this.options[key] = key in this.options ? this.options[key] : this.defaultOptions[key];
        // Add all other options
      } else {
        this.options[key] = this.options[key] || this.defaultOptions[key]
      }
    }
  }


  /**
   * unica funzione pubblica che permette di eseguire la ricerca
   */
  public search(pattern: string): any[] {
    if (this.options.verbose) console.log('\nSearch term:', pattern, '\n');

    this.pattern = pattern;
    this.results = [];
    this.resultMap = {};
    this._keyMap = null;

    this._prepareSearchers();
    this._startSearch();
    this._computeScore();
    this._sort();

    let output = this._format();
    return output
  }


  private defaultOptions: any = {
    // The name of the identifier property. If specified, the returned result will be a list
    // of the items' dentifiers, otherwise it will be a list of the items.
    id: null,

    // Indicates whether comparisons should be case sensitive.

    caseSensitive: false,

    // An array of values that should be included from the searcher's output. When this array
    // contains elements, each result in the list will be of the form `{ item: ..., include1: ..., include2: ... }`.
    // Values you can include are `score`, `matchedLocations`
    include: [],

    // Whether to sort the result list, by score
    shouldSort: true,

    // The search function to use
    // Note that the default search function ([[Function]]) must conform to the following API:
    //
    //  @param pattern The pattern string to search
    //  @param options The search option
    //  [[Function]].constructor = function(pattern, options)
    //
    //  @param text: the string to search in for the pattern
    //  @return Object in the form of:
    //    - isMatch: boolean
    //    - score: Int
    //  [[Function]].prototype.search = function(text)
    searchFn: BitapSearcher,

    // Default sort function
    sortFn: function (a: any, b: any) {
      return a.score - b.score
    },

    // The get function to use when fetching an object's properties.
    // The default will search nested paths *ie foo.bar.baz*
    getFn: this.deepValue,

    // List of properties that will be searched. This also supports nested properties.
    keys: [],

    // Will print to the console. Useful for debugging.
    verbose: false,

    // When true, the search algorithm will search individual words **and** the full string,
    // computing the final score as a function of both. Note that when `tokenize` is `true`,
    // the `threshold`, `distance`, and `location` are inconsequential for individual tokens.
    tokenize: false,

    // When true, the result set will only include records that match all tokens. Will only work
    // if `tokenize` is also true.
    matchAllTokens: false,

    // Regex used to separate words when searching. Only applicable when `tokenize` is `true`.
    tokenSeparator: / +/g
  }




  /**
   * Sets a new list for Fuse to match against.
   */
  private _set(list: any) {
    this.list = list
    return list
  }


  private _prepareSearchers() {
    let options = this.options
    let pattern = this.pattern
    let searchFn = options.searchFn
    let tokens = pattern.split(options.tokenSeparator)
    let i = 0
    let len = tokens.length

    if (this.options.tokenize) {
      this.tokenSearchers = []
      for (; i < len; i++) {
        this.tokenSearchers.push(new searchFn(tokens[i], options))
      }
    }
    this.fullSeacher = new searchFn(pattern, options)
  }




  private _startSearch() {
    var options = this.options
    var getFn = options.getFn
    var list = this.list
    var listLen = list.length
    var keys = this.options.keys
    var keysLen = keys.length
    var key
    var weight
    var item = null
    var i
    var j

    // Check the first item in the list, if it's a string, then we assume
    // that every item in the list is also a string, and thus it's a flattened array.
    if (typeof list[0] === 'string') {
      // Iterate over every item
      for (i = 0; i < listLen; i++) {
        this._analyze('', list[i], i, i)
      }
    } else {
      this._keyMap = {}
      // Otherwise, the first item is an Object (hopefully), and thus the searching
      // is done on the values of the keys of each item.
      // Iterate over every item
      for (i = 0; i < listLen; i++) {
        item = list[i]
        // Iterate over every key
        for (j = 0; j < keysLen; j++) {
          key = keys[j]
          if (typeof key !== 'string') {
            weight = (1 - key.weight) || 1
            this._keyMap[key.name] = {
              weight: weight
            }
            if (key.weight <= 0 || key.weight > 1) {
              throw new Error('Key weight has to be > 0 and <= 1')
            }
            key = key.name
          } else {
            this._keyMap[key] = {
              weight: 1
            }
          }
          this._analyze(key, getFn(item, key, []), item, i)
        }
      }
    }
  }





  private _analyze(key: any, text: any, entity: any, index: any) {
    var options = this.options
    var words
    var scores
    var exists = false
    var existingResult
    var averageScore
    var finalScore
    var scoresLen
    var mainSearchResult
    var tokenSearcher
    var termScores
    var word
    var tokenSearchResult
    var hasMatchInText
    var checkTextMatches
    var i
    var j

    // Check if the text can be searched
    if (text === undefined || text === null) {
      return
    }

    scores = []

    var numTextMatches = 0

    if (typeof text === 'string') {
      words = text.split(options.tokenSeparator)

      if (options.verbose) console.log('---------\nKey:', key)

      if (this.options.tokenize) {
        for (i = 0; i < this.tokenSearchers.length; i++) {
          tokenSearcher = this.tokenSearchers[i]

          if (options.verbose) console.log('Pattern:', tokenSearcher.pattern)

          termScores = []
          hasMatchInText = false

          for (j = 0; j < words.length; j++) {
            word = words[j]
            tokenSearchResult = tokenSearcher.search(word)
            var obj = {}
            if (tokenSearchResult.isMatch) {
              obj[word] = tokenSearchResult.score
              exists = true
              hasMatchInText = true
              scores.push(tokenSearchResult.score)
            } else {
              obj[word] = 1
              if (!this.options.matchAllTokens) {
                scores.push(1)
              }
            }
            termScores.push(obj)
          }

          if (hasMatchInText) {
            numTextMatches++
          }

          if (options.verbose) console.log('Token scores:', termScores)
        }

        averageScore = scores[0]
        scoresLen = scores.length
        for (i = 1; i < scoresLen; i++) {
          averageScore += scores[i]
        }
        averageScore = averageScore / scoresLen

        if (options.verbose) console.log('Token score average:', averageScore)
      }

      mainSearchResult = this.fullSeacher.search(text)
      if (options.verbose) console.log('Full text score:', mainSearchResult.score)

      finalScore = mainSearchResult.score
      if (averageScore !== undefined) {
        finalScore = (finalScore + averageScore) / 2
      }

      if (options.verbose) console.log('Score average:', finalScore)

      checkTextMatches = (this.options.tokenize && this.options.matchAllTokens) ? numTextMatches >= this.tokenSearchers.length : true

      if (options.verbose) console.log('Check Matches', checkTextMatches)

      // If a match is found, add the item to <rawResults>, including its score
      if ((exists || mainSearchResult.isMatch) && checkTextMatches) {
        // Check if the item already exists in our results
        existingResult = this.resultMap[index]

        if (existingResult) {
          // Use the lowest score
          // existingResult.score, bitapResult.score
          existingResult.output.push({
            key: key,
            score: finalScore,
            matchedIndices: mainSearchResult.matchedIndices
          })
        } else {
          // Add it to the raw result list
          this.resultMap[index] = {
            item: entity,
            output: [{
              key: key,
              score: finalScore,
              matchedIndices: mainSearchResult.matchedIndices
            }]
          }

          this.results.push(this.resultMap[index])
        }
      }
    } else if (this.isArray(text)) {
      for (i = 0; i < text.length; i++) {
        this._analyze(key, text[i], entity, index)
      }
    }
  }

  private _computeScore() {
    var i
    var j
    var keyMap = this._keyMap
    var totalScore
    var output
    var scoreLen
    var score
    var weight
    var results = this.results
    var bestScore
    var nScore

    if (this.options.verbose) console.log('\n\nComputing score:\n')

    for (i = 0; i < results.length; i++) {
      totalScore = 0
      output = results[i].output
      scoreLen = output.length

      bestScore = 1

      for (j = 0; j < scoreLen; j++) {
        score = output[j].score
        weight = keyMap ? keyMap[output[j].key].weight : 1

        nScore = score * weight

        if (weight !== 1) {
          bestScore = Math.min(bestScore, nScore)
        } else {
          totalScore += nScore
          output[j].nScore = nScore
        }
      }

      if (bestScore === 1) {
        results[i].score = totalScore / scoreLen
      } else {
        results[i].score = bestScore
      }

      if (this.options.verbose) console.log(results[i])
    }
  }

  private _sort() {
    var options = this.options
    if (options.shouldSort) {
      if (options.verbose) console.log('\n\nSorting....')
      this.results.sort(options.sortFn)
    }
  }

  private _format() {
    var options = this.options
    var getFn = options.getFn
    var finalOutput = []
    var item
    var i
    var len
    var results = this.results
    var replaceValue
    var getItemAtIndex
    var include = options.include

    if (options.verbose) console.log('\n\nOutput:\n\n', results)

    // Helper function, here for speed-up, which replaces the item with its value,
    // if the options specifies it,
    replaceValue = options.id ? function (index: any) {
      results[index].item = getFn(results[index].item, options.id, [])[0]
    } : function () { }

    getItemAtIndex = function (index: any) {
      let record = results[index]
      let data: any
      let j
      let output
      let _item
      let _result: any

      // If `include` has values, put the item in the result
      if (include.length > 0) {
        data = {
          item: record.item
        }
        if (include.indexOf('matches') !== -1) {
          output = record.output
          data.matches = []
          for (j = 0; j < output.length; j++) {
            _item = output[j]
            _result = {
              indices: _item.matchedIndices
            }
            if (_item.key) {
              _result.key = _item.key
            }
            data.matches.push(_result)
          }
        }

        if (include.indexOf('score') !== -1) {
          data.score = results[index].score
        }

      } else {
        data = record.item
      }

      return data
    }

    // From the results, push into a new array only the item identifier (if specified)
    // of the entire item.  This is because we don't want to return the <results>,
    // since it contains other metadata
    for (i = 0, len = results.length; i < len; i++) {
      replaceValue(i)
      item = getItemAtIndex(i)
      finalOutput.push(item)
    }

    return finalOutput
  }

  // Helpers

  private deepValue(obj: any, path: any, list: any) {
    var firstSegment
    var remaining
    var dotIndex
    var value
    var i
    var len

    if (!path) {
      // If there's no path left, we've gotten to the object we care about.
      list.push(obj)
    } else {
      dotIndex = path.indexOf('.')

      if (dotIndex !== -1) {
        firstSegment = path.slice(0, dotIndex)
        remaining = path.slice(dotIndex + 1)
      } else {
        firstSegment = path
      }

      value = obj[firstSegment]
      if (value !== null && value !== undefined) {
        if (!remaining && (typeof value === 'string' || typeof value === 'number')) {
          list.push(value)
        } else if (this.isArray(value)) {
          // Search each item in the array.
          for (i = 0, len = value.length; i < len; i++) {
            this.deepValue(value[i], remaining, list)
          }
        } else if (remaining) {
          // An object. Recurse further.
          this.deepValue(value, remaining, list)
        }
      }
    }

    return list
  }

  private isArray(obj: any) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }

}//chiude la classe






export class BitapSearcher {

  private options: any;
  private patternLen: any;
  private matchmask: any;
  private patternAlphabet: any;

  constructor(private pattern: any, options: any) {
    this.options = options || {}
    this.options.location = options.location || this.defaultOptions.location
    this.options.distance = 'distance' in options ? options.distance : this.defaultOptions.distance
    this.options.threshold = 'threshold' in options ? options.threshold : this.defaultOptions.threshold
    this.options.maxPatternLength = options.maxPatternLength || this.defaultOptions.maxPatternLength

    this.pattern = options.caseSensitive ? pattern : pattern.toLowerCase()
    this.patternLen = pattern.length

    if (this.patternLen <= this.options.maxPatternLength) {
      this.matchmask = 1 << (this.patternLen - 1)
      this.patternAlphabet = this._calculatePatternAlphabet()
    }
  }





  private defaultOptions = {
    // Approximately where in the text is the pattern expected to be found?
    location: 0,

    // Determines how close the match must be to the fuzzy location (specified above).
    // An exact letter match which is 'distance' characters away from the fuzzy location
    // would score as a complete mismatch. A distance of '0' requires the match be at
    // the exact location specified, a threshold of '1000' would require a perfect match
    // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
    distance: 100,

    // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
    // (of both letters and location), a threshold of '1.0' would match anything.
    threshold: 0.6,

    // Machine word size
    maxPatternLength: 32
  }


  /**
   * Initialize the alphabet for the Bitap algorithm.
   * @return {Object} Hash of character locations.
   * @private
   */
  private _calculatePatternAlphabet = function () {
    var mask = {},
      i = 0

    for (i = 0; i < this.patternLen; i++) {
      mask[this.pattern.charAt(i)] = 0
    }

    for (i = 0; i < this.patternLen; i++) {
      mask[this.pattern.charAt(i)] |= 1 << (this.pattern.length - i - 1)
    }

    return mask
  }

  /**
   * Compute and return the score for a match with `e` errors and `x` location.
   * @param {number} errors Number of errors in match.
   * @param {number} location Location of match.
   * @return {number} Overall score for match (0.0 = good, 1.0 = bad).
   * @private
   */
  private _bitapScore = function (errors: any, location: any) {
    var accuracy = errors / this.patternLen,
      proximity = Math.abs(this.options.location - location)

    if (!this.options.distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy
    }
    return accuracy + (proximity / this.options.distance)
  }

  /**
   * Compute and return the result of the search
   * @param {string} text The text to search in
   * @return {{isMatch: boolean, score: number}} Literal containing:
   *                          isMatch - Whether the text is a match or not
   *                          score - Overall score for the match
   * @public
   */
  private search = function (text: any) {
    var options = this.options
    var i
    var j
    var textLen
    var location
    var threshold
    var bestLoc
    var binMin
    var binMid
    var binMax
    var start, finish
    var bitArr
    var lastBitArr
    var charMatch
    var score
    var locations
    var matches
    var isMatched
    var matchMask
    var matchedIndices
    var matchesLen
    var match

    text = options.caseSensitive ? text : text.toLowerCase()

    if (this.pattern === text) {
      // Exact match
      return {
        isMatch: true,
        score: 0,
        matchedIndices: [[0, text.length - 1]]
      }
    }

    // When pattern length is greater than the machine word length, just do a a regex comparison
    if (this.patternLen > options.maxPatternLength) {
      matches = text.match(new RegExp(this.pattern.replace(options.tokenSeparator, '|')))
      isMatched = !!matches

      if (isMatched) {
        matchedIndices = []
        for (i = 0, matchesLen = matches.length; i < matchesLen; i++) {
          match = matches[i]
          matchedIndices.push([text.indexOf(match), match.length - 1])
        }
      }

      return {
        isMatch: isMatched,
        // TODO: revisit this score
        score: isMatched ? 0.5 : 1,
        matchedIndices: matchedIndices
      }
    }

    location = options.location
    // Set starting location at beginning text and initialize the alphabet.
    textLen = text.length
    // Highest score beyond which we give up.
    threshold = options.threshold
    // Is there a nearby exact match? (speedup)
    bestLoc = text.indexOf(this.pattern, location)

    // a mask of the matches
    matchMask = []
    for (i = 0; i < textLen; i++) {
      matchMask[i] = 0
    }

    if (bestLoc != -1) {
      threshold = Math.min(this._bitapScore(0, bestLoc), threshold)
      // What about in the other direction? (speed up)
      bestLoc = text.lastIndexOf(this.pattern, location + this.patternLen)

      if (bestLoc != -1) {
        threshold = Math.min(this._bitapScore(0, bestLoc), threshold)
      }
    }

    bestLoc = -1
    score = 1
    locations = []
    binMax = this.patternLen + textLen

    for (i = 0; i < this.patternLen; i++) {
      // Scan for the best match; each iteration allows for one more error.
      // Run a binary search to determine how far from the match location we can stray
      // at this error level.
      binMin = 0
      binMid = binMax
      while (binMin < binMid) {
        if (this._bitapScore(i, location + binMid) <= threshold) {
          binMin = binMid
        } else {
          binMax = binMid
        }
        binMid = Math.floor((binMax - binMin) / 2 + binMin)
      }

      // Use the result from this iteration as the maximum for the next.
      binMax = binMid
      start = Math.max(1, location - binMid + 1)
      finish = Math.min(location + binMid, textLen) + this.patternLen

      // Initialize the bit array
      bitArr = Array(finish + 2)

      bitArr[finish + 1] = (1 << i) - 1

      for (j = finish; j >= start; j--) {
        charMatch = this.patternAlphabet[text.charAt(j - 1)]

        if (charMatch) {
          matchMask[j - 1] = 1
        }

        if (i === 0) {
          // First pass: exact match.
          bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch
        } else {
          // Subsequent passes: fuzzy match.
          bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch | (((lastBitArr[j + 1] | lastBitArr[j]) << 1) | 1) | lastBitArr[j + 1]
        }
        if (bitArr[j] & this.matchmask) {
          score = this._bitapScore(i, j - 1)

          // This match will almost certainly be better than any existing match.
          // But check anyway.
          if (score <= threshold) {
            // Indeed it is
            threshold = score
            bestLoc = j - 1
            locations.push(bestLoc)

            if (bestLoc > location) {
              // When passing loc, don't exceed our current distance from loc.
              start = Math.max(1, 2 * location - bestLoc)
            } else {
              // Already passed loc, downhill from here on in.
              break
            }
          }
        }
      }

      // No hope for a (better) match at greater error levels.
      if (this._bitapScore(i + 1, location) > threshold) {
        break
      }
      lastBitArr = bitArr
    }

    matchedIndices = this._getMatchedIndices(matchMask)

    // Count exact matches (those with a score of 0) to be "almost" exact
    return {
      isMatch: bestLoc >= 0,
      score: score === 0 ? 0.001 : score,
      matchedIndices: matchedIndices
    }
  }

  private _getMatchedIndices = function (matchMask: any) {
    var matchedIndices = []
    var start = -1
    var end = -1
    var i = 0
    var match
    var len = matchMask.length
    for (; i < len; i++) {
      match = matchMask[i]
      if (match && start === -1) {
        start = i
      } else if (!match && start !== -1) {
        end = i - 1
        matchedIndices.push([start, end])
        start = -1
      }
    }
    if (matchMask[i - 1]) {
      matchedIndices.push([start, i - 1])
    }
    return matchedIndices
  }

}//chiude la classe
















/**
* interfacce delle opzioni extended
*/
export interface IFuseOptions extends ISearchOptions {
  id?: any;
  caseSensitive?: boolean;
  include?: string[];
  shouldSort?: boolean;
  searchFn?: any;
  sortFn?: (a: { score: number }, b: { score: number }) => number;
  getFn?: (obj: any, path: string, list?: any[]) => any;
  keys?: string[] | { name: string; weight: number }[];
  verbose?: boolean;
}





/**
* interfaccia delle opzioi base
*/
export interface ISearchOptions {
  tokenize?: boolean;
  tokenSeparator?: RegExp;
  matchAllTokens?: boolean;
  location?: number;
  distance?: number;
  threshold?: number;
  maxPatternLength?: number;
}



