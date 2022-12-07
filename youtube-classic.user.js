// ==UserScript==
// @name         YouTube™ Classic 📺
// @version      2022.12.07
// @author       Adam Lui, Magma_Craft, Anarios & JRWR
// @namespace    https://elonsucks.org/@adam
// @description  Reverts YouTube to its classic design (before rounded corners & hidden dislikes)
// @supportURL   https://github.com/adamlui/userscripts/issues
// @match        https://*.youtube.com/*
// @icon         https://i.imgur.com/0nQsOmv.png
// @run-at       document-start
// @grant        none
// @updateURL    https://greasyfork.org/scripts/456132-youtube-classic/code/youtube-classic.meta.js
// @downloadURL  https://greasyfork.org/scripts/456132-youtube-classic/code/youtube-classic.user.js
// ==/UserScript==

// Config keys
const CONFIGS = { BUTTON_REWORK: false }

// Experiment flags
const EXPFLAGS = {
    enable_programmed_playlist_redesign: false,
    kevlar_refresh_on_theme_change: false,
    kevlar_use_ytd_player: false,
    kevlar_watch_cinematics: false,
    kevlar_watch_metadata_refresh: false,
    kevlar_watch_modern_metapanel: false,
    kevlar_watch_modern_panels: false,
    web_amsterdam_playlists: false,
    web_animated_like: false,
    web_animated_like_lazy_load: false,
    web_button_rework: false,
    web_darker_dark_theme: false,
    web_guide_ui_refresh: false,
    web_modern_buttons: false,
    web_modern_chips: false,
    web_modern_dialogs: false,
    web_modern_playlists: false,
    web_modern_subscribe: false,
    web_rounded_containers: false,
    web_rounded_thumbnails: false,
    web_searchbar_style: "default",
    web_segmented_like_dislike_button: false,
    web_sheets_ui_refresh: false,
    web_snackbar_ui_refresh: false
}

// Player flags
const PLYRFLAGS = { web_player_move_autonav_toggle: "true" }

class YTP {
    static observer = new MutationObserver(this.onNewScript);
    static _config = {};
    static isObject(item) {
        return (item && typeof item === "object" && !Array.isArray(item));
    }
    static mergeDeep(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        return this.mergeDeep(target, ...sources);
    }
    static onNewScript(mutations) {
        for (var mut of mutations) {
            for (var node of mut.addedNodes) {
                YTP.bruteforce();
            }
        }
    }
    static start() { this.observer.observe(document, {childList: true, subtree: true}); }
    static stop() { this.observer.disconnect(); }
    static bruteforce() {
        if (!window.yt) return;
        if (!window.yt.config_) return;
        this.mergeDeep(window.yt.config_, this._config);
    }
    static setCfg(name, value) { this._config[name] = value; }
    static setCfgMulti(configs) { this.mergeDeep(this._config, configs); }
    static setExp(name, value) {
        if (!("EXPERIMENT_FLAGS" in this._config)) this._config.EXPERIMENT_FLAGS = {};
        this._config.EXPERIMENT_FLAGS[name] = value;
    }
    static setExpMulti(exps) {
        if (!("EXPERIMENT_FLAGS" in this._config)) this._config.EXPERIMENT_FLAGS = {};
        this.mergeDeep(this._config.EXPERIMENT_FLAGS, exps);
    }
    static decodePlyrFlags(flags) {
        var obj = {},
            dflags = flags.split("&");
        for (var i = 0; i < dflags.length; i++) {
            var dflag = dflags[i].split("=");
            obj[dflag[0]] = dflag[1];
        }
        return obj;
    }
    static encodePlyrFlags(flags) {
        var keys = Object.keys(flags),
            response = "";
        for (var i = 0; i < keys.length; i++) {
            if (i > 0) { response += "&"; }
            response += keys[i] + "=" + flags[keys[i]];
        }
        return response;
    }
    static setPlyrFlags(flags) {
        if (!window.yt) return;
        if (!window.yt.config_) return;
        if (!window.yt.config_.WEB_PLAYER_CONTEXT_CONFIGS) return;
        var conCfgs = window.yt.config_.WEB_PLAYER_CONTEXT_CONFIGS;
        if (!("WEB_PLAYER_CONTEXT_CONFIGS" in this._config)) this._config.WEB_PLAYER_CONTEXT_CONFIGS = {};
        for (var cfg in conCfgs) {
            var dflags = this.decodePlyrFlags(conCfgs[cfg].serializedExperimentFlags);
            this.mergeDeep(dflags, flags);
            this._config.WEB_PLAYER_CONTEXT_CONFIGS[cfg] = {
                serializedExperimentFlags: this.encodePlyrFlags(dflags)
            }
        }
    }
}

window.addEventListener("yt-page-data-updated", function tmp() {
    var innerHTML = "<img style='margin-left:5px;' height=65 src='https://i.imgur.com/rHLcxEs.png'>"; // Replace YouTube logo
    document.getElementById('logo-icon').innerHTML = innerHTML;
    YTP.stop();
    for (i = 0; i < ATTRS.length; i++) { document.getElementsByTagName("html")[0].removeAttribute(ATTRS[i]); }
    window.removeEventListener("yt-page-date-updated", tmp);
});

YTP.start();

YTP.setCfgMulti(CONFIGS);
YTP.setExpMulti(EXPFLAGS);
YTP.setPlyrFlags(PLYRFLAGS);


function $(q) { return document.querySelector(q); }

// CSS tweaks
(function() {
ApplyCSS();
function ApplyCSS() {
var styles = document.createElement("style");
styles.innerHTML=`
    div#clarify-box.attached-message.style-scope.ytd-watch-flexy, #cinematics.ytd-watch-flexy {
        display: none;
    }
    div#ytp-id-18.ytp-popup,ytp-settings-menu.ytp-rounded-menu, div.branding-context-container-inner.ytp-rounded-branding-context, div.ytp-sb-subscribe.ytp-sb-rounded, .ytp-sb-unsubscribe.ytp-sb-rounded {
        border-radius: 2px;
    }
    div.iv-card.iv-card-video.ytp-rounded-info, div.iv-card.iv-card-playlist.ytp-rounded-info, div.iv-card.iv-card-channel.ytp-rounded-info, div.iv-card.ytp-rounded-info, .ytp-tooltip.ytp-rounded-tooltip.ytp-text-detail.ytp-preview, .ytp-tooltip.ytp-rounded-tooltip.ytp-text-detail.ytp-preview .ytp-tooltip-bg {
        border-radius: 0px;
    }
    yt-formatted-string.style-scope.ytd-button-renderer.style-suggestive.size-small, yt-formatted-string.style-scope.ytd-button-renderer.style-suggestive.size-default, yt-formatted-string#text.style-scope.ytd-button-renderer.style-destructive.size-default, yt-formatted-string.style-scope.ytd-toggle-button-renderer.style-text, yt-formatted-string.style-scope.ytd-button-renderer.style-default.size-default, yt-formatted-string.style-scope.ytd-toggle-button-renderer.style-default-active, yt-formatted-string#text.style-scope.ytd-button-renderer, yt-formatted-stringx#text, div#icon-label.yt-dropdown-menu, tp-yt-paper-tab tp-yt-paper-tab .tp-yt-paper-tab[style-target=tab-content], .tp-yt-paper-tab[style-target=tab-content], yt-formatted-string#guide-section-title.style-scope.ytd-guide-section-renderer {
        letter-spacing: 0.5px;
    }
    yt-formatted-string.style-scope.yt-chip-cloud-chip-renderer {
        font-size: 1.4rem;;
        letter-spacing: 0.2px;
        padding-bottom: 1px;
    }`
document.head.appendChild(styles);
}
})();

// Fix YouTube dislikes

addEventListener('yt-page-data-updated', function() {
    if(!location.pathname.startsWith('/watch')) return;
    var lds = $('ytd-video-primary-info-renderer div#top-level-buttons-computed');
    var like = $('ytd-video-primary-info-renderer div#segmented-like-button > ytd-toggle-button-renderer');
    var share = $('ytd-video-primary-info-renderer div#top-level-buttons-computed > ytd-segmented-like-dislike-button-renderer + ytd-button-renderer');
    lds.insertBefore(like, share);
    like.setAttribute('class', like.getAttribute('class').replace('ytd-segmented-like-dislike-button-renderer', 'ytd-menu-renderer force-icon-button'));
    like.removeAttribute('is-paper-button-with-icon');
    like.removeAttribute('is-paper-button');
    like.setAttribute('style-action-button', '');
    like.setAttribute('is-icon-button', '');
    like.querySelector('a').insertBefore(like.querySelector('yt-formatted-string'), like.querySelector('tp-yt-paper-tooltip'));
    try { like.querySelector('paper-ripple').remove(); } catch(e) {}
    var paper = like.querySelector('tp-yt-paper-button');
    paper.removeAttribute('style-target');
    paper.removeAttribute('animated');
    paper.removeAttribute('elevation');
    like.querySelector('a').insertBefore(paper.querySelector('yt-icon'), like.querySelector('yt-formatted-string'));
    paper.outerHTML = paper.outerHTML.replace('<tp-yt-paper-button ', '<yt-icon-button ').replace('</tp-yt-paper-button>', '</yt-icon-button>');
    paper = like.querySelector('yt-icon-button');
    paper.querySelector('button#button').appendChild(like.querySelector('yt-icon'));
    var dislike = $('ytd-video-primary-info-renderer div#segmented-dislike-button > ytd-toggle-button-renderer');
    lds.insertBefore(dislike, share);
    $('ytd-video-primary-info-renderer ytd-segmented-like-dislike-button-renderer').remove();
    dislike.setAttribute('class', dislike.getAttribute('class').replace('ytd-segmented-like-dislike-button-renderer', 'ytd-menu-renderer force-icon-button'));
    dislike.removeAttribute('has-no-text');
    dislike.setAttribute('style-action-button', '');
    var dlabel = document.createElement('yt-formatted-stringx');
    dlabel.setAttribute('id', 'text');
    if(dislike.getAttribute('class').includes('style-default-active')) {
        dlabel.setAttribute('class', dlabel.getAttribute('class').replace('style-default', 'style-default-active')) };
    dislike.querySelector('a').insertBefore(dlabel, dislike.querySelector('tp-yt-paper-tooltip'));
    $('ytd-video-primary-info-renderer').removeAttribute('flex-menu-enabled');
});

const extConfig = {
    // BEGIN USER OPTIONS
    // You may change the following variables to allowed values listed in the corresponding brackets (* means default). Keep the style and keywords intact.
    showUpdatePopup: false, // [true, false*] Show a popup tab after extension update (See what's new)
    disableVoteSubmission: false, // [true, false*] Disable like/dislike submission (Stops counting your likes and dislikes)
    coloredThumbs: false, // [true, false*] Colorize thumbs (Use custom colors for thumb icons)
    coloredBar: false, // [true, false*] Colorize ratio bar (Use custom colors for ratio bar)
    colorTheme: "classic", // [classic*, accessible, neon] Color theme (red/green, blue/yellow, pink/cyan)
    numberDisplayFormat: "compactShort", // [compactShort*, compactLong, standard] Number format (For non-English locale users, you may be able to improve appearance with a different option. Please file a feature request if your locale is not covered)
    numberDisplayRoundDown: true, // [true*, false] Round down numbers (Show rounded down numbers)
    tooltipPercentageMode: "none", // [none*, dash_like, dash_dislike, both, only_like, only_dislike] Mode of showing percentage in like/dislike bar tooltip.
    numberDisplayReformatLikes: false, // [true, false*] Re-format like numbers (Make likes and dislikes format consistent)
    // END USER OPTIONS
};

const LIKED_STATE = "LIKED_STATE";
const DISLIKED_STATE = "DISLIKED_STATE";
const NEUTRAL_STATE = "NEUTRAL_STATE";
let previousState = 3; // 1=LIKED, 2=DISLIKED, 3=NEUTRAL
let likesvalue = 0;
let dislikesvalue = 0;
let isMobile = location.hostname == "m.youtube.com";
let isShorts = () => location.pathname.startsWith("/shorts");
let mobileDislikes = 0;

function cLog(text, subtext = "") {
    subtext = subtext.trim() === "" ? "" : `(${subtext})`;
    console.log(`[Return YouTube Dislikes] ${text} ${subtext}`);
}

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const height = innerHeight || document.documentElement.clientHeight;
    const width = innerWidth || document.documentElement.clientWidth;
    return (
        // When short (channel) is ignored, the element (like/dislike AND short itself) is
        // hidden with a 0 DOMRect. In this case, consider it outside of Viewport
        !(rect.top == 0 && rect.left == 0 && rect.bottom == 0 && rect.right == 0) &&
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= height &&
        rect.right <= width
    );
}

function getButtons() {
    if (isShorts()) {
        let elements = document.querySelectorAll(
            isMobile
                ? "ytm-like-button-renderer"
                : "#like-button > ytd-like-button-renderer"
        );
        for (let element of elements) {
            if (isInViewport(element)) {
                return element;
            }
        }
    }
    if (isMobile) {
        return (
            document.querySelector(".slim-video-action-bar-actions .segmented-buttons") ??
            document.querySelector(".slim-video-action-bar-actions")
        );
    }
    if (document.getElementById("menu-container")?.offsetParent === null) {
        return (
            document.querySelector("ytd-menu-renderer.ytd-watch-metadata > div") ??
            document.querySelector("ytd-menu-renderer.ytd-video-primary-info-renderer > div")
    );
    } else {
        return document
            .getElementById("menu-container")
            ?.querySelector("#top-level-buttons-computed");
    }
}

function getLikeButton() {
    return getButtons().children[0].tagName ===
        "YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER"
        ? getButtons().children[0].children[0]
        : getButtons().children[0];
}

function getLikeTextContainer() {
    return (
        getLikeButton().querySelector("#text") ??
        getLikeButton().getElementsByTagName("yt-formatted-string")[0] ??
        getLikeButton().querySelector("span[role='text']")
    );
}

function getDislikeButton() {
    return getButtons().children[0].tagName ===
        "YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER"
        ? getButtons().children[0].children[1]
        : getButtons().children[1];
}

function getDislikeTextContainer() {
    let result =
        getDislikeButton().querySelector("#text") ??
        getDislikeButton().getElementsByTagName("yt-formatted-string")[0] ??
        getDislikeButton().querySelector("span[role='text']")
    if (result === null) {
        let textSpan = document.createElement("span");
        textSpan.id = "text";
        textSpan.style.marginLeft = "2px";
        getDislikeButton().querySelector("button").appendChild(textSpan);
        getDislikeButton().querySelector("button").style.width = "auto";
        result = getDislikeButton().querySelector("#text");
    }
    return result;
}

let mutationObserver = new Object();

if (isShorts() && mutationObserver.exists !== true) {
    cLog("initializing mutation observer");
    mutationObserver.options = {
        childList: false,
        attributes: true,
        subtree: false,
    };
    mutationObserver.exists = true;
    mutationObserver.observer = new MutationObserver(function (
        mutationList,
        observer
    ) {
        mutationList.forEach((mutation) => {
            if (
                mutation.type === "attributes" &&
                mutation.target.nodeName === "TP-YT-PAPER-BUTTON" &&
                mutation.target.id === "button"
            ) {
                cLog("Short thumb button status changed");
                if (mutation.target.getAttribute("aria-pressed") === "true") {
                    mutation.target.style.color =
                        mutation.target.parentElement.parentElement.id === "like-button"
                    ? getColorFromTheme(true)
                    : getColorFromTheme(false);
                } else {
                    mutation.target.style.color = "unset";
                }
                return;
            }
            cLog(
                "unexpected mutation observer event: " + mutation.target + mutation.type
            );
        });
    });
}

function isVideoLiked() {
    if (isMobile) {
        return (
            getLikeButton().querySelector("button").getAttribute("aria-label") ==
            "true"
        );
    }
    return getLikeButton().classList.contains("style-default-active");
}

function isVideoDisliked() {
    if (isMobile) {
        return (
            getDislikeButton().querySelector("button").getAttribute("aria-label") ==
            "true"
        );
    }
    return getDislikeButton().classList.contains("style-default-active");
}

function isVideoNotLiked() {
    if (isMobile) { return !isVideoLiked(); }
    return getLikeButton().classList.contains("style-text");
}

function isVideoNotDisliked() {
    if (isMobile) { return !isVideoDisliked(); }
    return getDislikeButton().classList.contains("style-text");
}

function checkForUserAvatarButton() {
    if (isMobile) { return; }
    if (document.querySelector("#avatar-btn")) { return true;
    } else { return false; }
}

function getState() {
    if (isVideoLiked()) { return LIKED_STATE; }
    if (isVideoDisliked()) { return DISLIKED_STATE; }
    return NEUTRAL_STATE;
}

function setLikes(likesCount) {
    if (isMobile) {
        getButtons().children[0].querySelector(".button-renderer-text").innerText =
            likesCount;
        return;
    }
    getLikeTextContainer().innerText = likesCount;
}

function setDislikes(dislikesCount) {
    if (isMobile) {
        mobileDislikes = dislikesCount;
        return;
    }
    getDislikeTextContainer()?.removeAttribute('is-empty');
    getDislikeTextContainer().innerText = dislikesCount;
}

function getLikeCountFromButton() {
    try {
        if (isShorts()) { return false; }
        let likeButton = getLikeButton()
        .querySelector("yt-formatted-string#text") ??
        getLikeButton().querySelector("button");
        let likesStr = likeButton.getAttribute("aria-label")
        .replace(/\D/g, "");
        return likesStr.length > 0 ? parseInt(likesStr) : false;
    }
    catch { return false; }
}

function createRateBar(likes, dislikes) {
    if (isMobile) { return; }
    let rateBar = document.getElementById("return-youtube-dislike-bar-container");
    const widthPx =
        getButtons().children[0].clientWidth +
        getButtons().children[1].clientWidth +
        8;
    const widthPercent = likes + dislikes > 0 ? (likes / (likes + dislikes)) * 100 : 50;
    var likePercentage = parseFloat(widthPercent.toFixed(1));
    const dislikePercentage = (100 - likePercentage).toLocaleString();
    likePercentage = likePercentage.toLocaleString();
    var tooltipInnerHTML;
    switch (extConfig.tooltipPercentageMode) {
        case "dash_like":
            tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}&nbsp;&nbsp;-&nbsp;&nbsp;${likePercentage}%`;
            break;
        case "dash_dislike":
            tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}&nbsp;&nbsp;-&nbsp;&nbsp;${dislikePercentage}%`;
            break;
        case "both":
            tooltipInnerHTML = `${likePercentage}%&nbsp;/&nbsp;${dislikePercentage}%`;
            break;
        case "only_like":
            tooltipInnerHTML = `${likePercentage}%`;
            break;
        case "only_dislike":
            tooltipInnerHTML = `${dislikePercentage}%`;
            break;
        default:
            tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}`;
    }
    if (!rateBar && !isMobile) {
        let colorLikeStyle = "";
        let colorDislikeStyle = "";
        if (extConfig.coloredBar) {
            colorLikeStyle = "; background-color: " + getColorFromTheme(true);
            colorDislikeStyle = "; background-color: " + getColorFromTheme(false);
        }
        document.getElementById("menu-container").insertAdjacentHTML(
            "beforeend",
            `
                <div class="ryd-tooltip" style="width: ${widthPx}px">
                <div class="ryd-tooltip-bar-container">
                    <div
                        id="return-youtube-dislike-bar-container"
                        style="width: 100%; height: 2px;${colorDislikeStyle}"
                        >
                        <div
                            id="return-youtube-dislike-bar"
                            style="width: ${widthPercent}%; height: 100%${colorDislikeStyle}"
                            ></div>
                    </div>
                </div>
                <tp-yt-paper-tooltip position="top" id="ryd-dislike-tooltip" class="style-scope ytd-sentiment-bar-renderer" role="tooltip" tabindex="-1">
                    <!--css-build:shady-->${tooltipInnerHTML}
                </tp-yt-paper-tooltip>
                </div>`
        );
    } else {
        document.getElementById(
            "return-youtube-dislike-bar-container"
        ).style.width = widthPx + "px";
        document.getElementById("return-youtube-dislike-bar").style.width =
            widthPercent + "%";
        document.querySelector("#ryd-dislike-tooltip > #tooltip").innerHTML =
            tooltipInnerHTML;
        if (extConfig.coloredBar) {
            document.getElementById(
                "return-youtube-dislike-bar-container"
            ).style.backgroundColor = getColorFromTheme(false);
            document.getElementById(
                "return-youtube-dislike-bar"
            ).style.backgroundColor = getColorFromTheme(true);
        }
    }
}

function setState() {
    cLog("Fetching votes...");
    let statsSet = false;
    fetch(
        `https://returnyoutubedislikeapi.com/votes?videoId=${getVideoId()}`
    ).then((response) => {
        response.json().then((json) => {
            if (json && !("traceId" in response) && !statsSet) {
                const { dislikes, likes } = json;
                cLog(`Received count: ${dislikes}`);
                likesvalue = likes;
                dislikesvalue = dislikes;
                setDislikes(numberFormat(dislikes));
                if (extConfig.numberDisplayReformatLikes === true) {
                    const nativeLikes = getLikeCountFromButton();
                    if (nativeLikes !== false) {
                        setLikes(numberFormat(nativeLikes));
                    }
                }
                createRateBar(likes, dislikes);
                if (extConfig.coloredThumbs === true) {
                    if (isShorts()) {
                        // for shorts, leave deactived buttons in default color
                        let shortLikeButton = getLikeButton().querySelector(
                            "tp-yt-paper-button#button"
                        );
                        let shortDislikeButton = getDislikeButton().querySelector(
                            "tp-yt-paper-button#button"
                        );
                        if (shortLikeButton.getAttribute("aria-pressed") === "true") {
                            shortLikeButton.style.color = getColorFromTheme(true);
                        }
                        if (shortDislikeButton.getAttribute("aria-pressed") === "true") {
                            shortDislikeButton.style.color = getColorFromTheme(false);
                        }
                        mutationObserver.observer.observe(
                            shortLikeButton,
                            mutationObserver.options
                        );
                        mutationObserver.observer.observe(
                            shortDislikeButton,
                            mutationObserver.options
                        );
                    } else {
                        getLikeButton().style.color = getColorFromTheme(true);
                        getDislikeButton().style.color = getColorFromTheme(false);
                    }
                }
            }
        });
    });
}

function likeClicked() {
    if (checkForUserAvatarButton() == true) {
        if (previousState == 1) {
            likesvalue--;
            createRateBar(likesvalue, dislikesvalue);
            setDislikes(numberFormat(dislikesvalue));
            previousState = 3;
        } else if (previousState == 2) {
            likesvalue++;
            dislikesvalue--;
            setDislikes(numberFormat(dislikesvalue));
            createRateBar(likesvalue, dislikesvalue);
            previousState = 1;
        } else if (previousState == 3) {
            likesvalue++;
            createRateBar(likesvalue, dislikesvalue);
            previousState = 1;
        }
        if (extConfig.numberDisplayReformatLikes === true) {
            const nativeLikes = getLikeCountFromButton();
            if (nativeLikes !== false) { setLikes(numberFormat(nativeLikes)); }
        }
    }
}

function dislikeClicked() {
    if (checkForUserAvatarButton() == true) {
        if (previousState == 3) {
            dislikesvalue++;
            setDislikes(numberFormat(dislikesvalue));
            createRateBar(likesvalue, dislikesvalue);
            previousState = 2;
        } else if (previousState == 2) {
            dislikesvalue--;
            setDislikes(numberFormat(dislikesvalue));
            createRateBar(likesvalue, dislikesvalue);
            previousState = 3;
        } else if (previousState == 1) {
            likesvalue--;
            dislikesvalue++;
            setDislikes(numberFormat(dislikesvalue));
            createRateBar(likesvalue, dislikesvalue);
            previousState = 2;
            if (extConfig.numberDisplayReformatLikes === true) {
                const nativeLikes = getLikeCountFromButton();
                if (nativeLikes !== false) { setLikes(numberFormat(nativeLikes)); }
            }
        }
    }
}

function setInitialState() { setState(); }

function getVideoId() {
    const urlObject = new URL(window.location.href);
    const pathname = urlObject.pathname;
    if (pathname.startsWith("/clip")) { return document.querySelector("meta[itemprop='videoId']").content;
    } else {
        if (pathname.startsWith("/shorts")) { return pathname.slice(8); }
        return urlObject.searchParams.get("v");
    }
}

function isVideoLoaded() {
    if (isMobile) { return document.getElementById("player").getAttribute("loading") == "false"; }
    const videoId = getVideoId();
    return ( document.querySelector(`ytd-watch-flexy[video-id='${videoId}']`) !== null );
}

function roundDown(num) {
    if (num < 1000) return num;
    const int = Math.floor(Math.log10(num) - 2);
    const decimal = int + (int % 3 ? 1 : 0);
    const value = Math.floor(num / 10 ** decimal);
    return value * 10 ** decimal;
}

function numberFormat(numberState) {
    let numberDisplay;
    if (extConfig.numberDisplayRoundDown === false) { numberDisplay = numberState;
    } else { numberDisplay = roundDown(numberState); }
    return getNumberFormatter(extConfig.numberDisplayFormat).format(numberDisplay);
}

function getNumberFormatter(optionSelect) {
    let userLocales;
    if (document.documentElement.lang) { userLocales = document.documentElement.lang;
    } else if (navigator.language) { userLocales = navigator.language;
    } else {
        try {
            userLocales = new URL(
                Array.from(document.querySelectorAll("head > link[rel='search']"))
                    ?.find((n) => n?.getAttribute("href")?.includes("?locale="))
                    ?.getAttribute("href")
            )?.searchParams?.get("locale");
        } catch {
            cLog("Cannot find browser locale. Use en as default for number formatting.");
            userLocales = "en";
        }
    }
    let formatterNotation;
    let formatterCompactDisplay;
    switch (optionSelect) {
        case "compactLong":
            formatterNotation = "compact";
            formatterCompactDisplay = "long";
            break;
        case "standard":
            formatterNotation = "standard";
            formatterCompactDisplay = "short";
            break;
        case "compactShort":
        default:
            formatterNotation = "compact";
            formatterCompactDisplay = "short";
    }
    const formatter = Intl.NumberFormat(userLocales, {
        notation: formatterNotation,
        compactDisplay: formatterCompactDisplay,
    });
    return formatter;
}

function getColorFromTheme(voteIsLike) {
    let colorString;
    switch (extConfig.colorTheme) {
        case "accessible":
            if (voteIsLike === true) {
                colorString = "dodgerblue";
            } else { colorString = "gold"; }
            break;
        case "neon":
            if (voteIsLike === true) {
                colorString = "aqua";
            } else { colorString = "magenta"; }
            break;
        case "classic":
        default:
            if (voteIsLike === true) {
                colorString = "lime";
            } else { colorString = "red"; }
    }
    return colorString;
}

function setEventListeners(evt) {
    let jsInitChecktimer;
    function checkForJS_Finish() {
        if (isShorts() || (getButtons()?.offsetParent && isVideoLoaded())) {
            const buttons = getButtons();
            if (!window.returnDislikeButtonlistenersSet) {
                cLog("Registering button listeners...");
                try {
                    buttons.children[0].addEventListener("click", likeClicked);
                    buttons.children[1].addEventListener("click", dislikeClicked);
                    buttons.children[0].addEventListener("touchstart", likeClicked);
                    buttons.children[1].addEventListener("touchstart", dislikeClicked);
                } catch { return; }
                window.returnDislikeButtonlistenersSet = true;
            }
            setInitialState();
            clearInterval(jsInitChecktimer);
        }
    }
    cLog("Setting up...");
    jsInitChecktimer = setInterval(checkForJS_Finish, 111);
}

(function () {
    "use strict";
    window.addEventListener("yt-navigate-finish", setEventListeners, true);
    setEventListeners();
})();
if (isMobile) {
    let originalPush = history.pushState;
    history.pushState = function (...args) {
        window.returnDislikeButtonlistenersSet = false;
        setEventListeners(args[2]);
        return originalPush.apply(history, args);
    };
    setInterval(() => {
        if (getDislikeButton().querySelector(".button-renderer-text") === null) {
            getDislikeTextContainer().innerText = mobileDislikes;
        } else { getDislikeButton().querySelector(".button-renderer-text").innerText = mobileDislikes; }
    }, 1000);
}