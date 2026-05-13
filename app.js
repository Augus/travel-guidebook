(function () {
  const DEFAULT_CATALOG_PATH = "data/trips.json";
  const state = {
    modalContents: [],
    lastFocus: null
  };

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    document.querySelector("[data-print]")?.addEventListener("click", () => window.print());

    try {
      const { catalog, trip, selectedTrip } = await loadRouteData();

      if (trip) {
        renderTripPage(trip, catalog, selectedTrip);
      } else {
        renderCatalogPage(catalog);
      }

      bindModalControls();
    } catch (error) {
      renderLoadError(error);
    }
  }

  async function loadRouteData() {
    const params = new URLSearchParams(window.location.search);
    const catalogPath = params.get("catalog") || DEFAULT_CATALOG_PATH;
    const catalog = await fetchJson(catalogPath);

    const tripId = params.get("trip");
    if (!tripId) {
      return { catalog, trip: null, selectedTrip: null };
    }

    const selectedTrip = (catalog.trips || []).find(trip => trip.id === tripId);
    if (!selectedTrip) {
      throw new Error(`Trip id "${tripId}" is not defined in ${catalogPath}.`);
    }

    return {
      catalog,
      trip: await fetchJson(selectedTrip.data),
      selectedTrip
    };
  }

  async function fetchJson(path) {
    const response = await fetch(path, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.status}`);
    }

    return response.json();
  }

  function renderTripPage(data, catalog, selectedTrip) {
    setPrintEnabled(true);
    document.documentElement.lang = data.meta?.language || catalog.meta?.language || document.documentElement.lang;
    document.title = data.meta?.title || selectedTrip?.title || document.title;

      renderHeader(data.hero, {
        backHref: "./",
        backLabel: "\u8fd4\u56de\u76ee\u9304"
      });
    renderNav(data.nav || []);
    renderMain(data);
    renderModals(data.modals || []);
    scrollToCurrentHash();
  }

  function renderCatalogPage(catalog) {
    setPrintEnabled(false);
    document.documentElement.lang = catalog.meta?.language || document.documentElement.lang;
    document.title = catalog.meta?.title || document.title;

    clearHeader();
    renderNav([]);
    renderCatalog(catalog);
    renderModals([]);
  }

  function setPrintEnabled(enabled) {
    const printButton = document.querySelector("[data-print]");
    if (printButton) {
      printButton.hidden = !enabled;
      printButton.textContent = "\u5217\u5370 / \u5b58\u6210 PDF";
    }
  }

  function scrollToCurrentHash() {
    if (!window.location.hash) {
      return;
    }

    window.requestAnimationFrame(() => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = document.getElementById(id);

      if (target) {
        target.scrollIntoView({ block: "start" });
      }
    });
  }

  function renderHeader(hero, options = {}) {
    const mount = document.getElementById("siteHeader");
    mount.replaceChildren();

    const heroEl = create("div", { className: "hero" });
    if (hero?.image) {
      heroEl.style.backgroundImage = [
        "linear-gradient(90deg,rgba(18,22,20,.78),rgba(18,22,20,.35),rgba(18,22,20,.08))",
        `url(${JSON.stringify(hero.image)})`
      ].join(",");
    }

    const content = create("div", { className: "hero-content" }, [
      create("div", { className: "eyebrow", text: hero?.eyebrow || "" }),
      renderTitle("h1", hero?.title || []),
      create("p", { className: "lead", text: hero?.lead || "" }),
      create("div", { className: "hero-meta" }, (hero?.meta || []).map(item =>
        create("span", { className: "pill", text: item })
      ))
    ]);

    if (options.backHref) {
      heroEl.append(create("a", {
        className: "hero-back-link",
        attrs: {
          href: options.backHref,
          "aria-label": options.backLabel || "\u8fd4\u56de\u76ee\u9304"
        },
        text: `\u2190 ${options.backLabel || "\u8fd4\u56de\u76ee\u9304"}`
      }));
    }

    heroEl.append(content);
    mount.append(heroEl);
  }

  function clearHeader() {
    document.getElementById("siteHeader").replaceChildren();
  }

  function renderNav(items) {
    const mount = document.getElementById("siteNav");
    const nav = mount.closest(".nav");
    nav.hidden = items.length === 0;
    mount.replaceChildren(...items.map(item =>
      create("a", { attrs: { href: item.href }, text: item.label })
    ));
  }

  function renderMain(data) {
    const main = document.getElementById("app");
    main.replaceChildren(...[
      renderWelcome(data.welcome),
      renderPrep(data.prep),
      renderOverview(data.overview),
      ...(data.days || []).map(renderDay),
      renderFood(data.food),
      renderSources(data.sources),
      renderFooter(data.footer)
    ].filter(Boolean));
  }

  function renderCatalog(catalog) {
    const main = document.getElementById("app");
    const trips = catalog.trips || [];

    main.replaceChildren(...[
      create("section", { id: "trips", className: "catalog-section" }, [
        renderSectionHead({
          kicker: catalog.catalog?.kicker || "Library",
          title: catalog.catalog?.title || "\u65c5\u904a\u66f8\u7e3d\u76ee\u9304",
          note: catalog.catalog?.note || ""
        }),
        create("div", { className: "catalog-grid" }, trips.map(renderTripCard))
      ]),
      renderFooter(catalog.footer)
    ].filter(Boolean));
  }

  function renderFooter(text) {
    if (!text) {
      return null;
    }

    return create("div", { className: "footer" }, [
      create("p", { text })
    ]);
  }

  function renderTripCard(trip) {
    return create("article", { className: "card trip-card" }, [
      create("img", {
        className: "trip-card-image",
        attrs: {
          src: trip.image || "",
          alt: trip.imageAlt || trip.title || ""
        }
      }),
      create("div", { className: "trip-card-body" }, [
        create("div", { className: "day-num", text: trip.id }),
        create("h3", { text: trip.title }),
        create("p", { className: "trip-subtitle", text: trip.subtitle || "" }),
        create("p", { text: trip.description || "" }),
        create("div", { className: "meta-line" }, formatTripMeta(trip).map(item =>
          create("span", { className: "mini", text: item })
        )),
        create("div", { className: "modal-meta" }, (trip.tags || []).map(tag =>
          create("span", { text: tag })
        )),
        create("a", {
          className: "trip-link",
          attrs: { href: `?trip=${encodeURIComponent(trip.id)}` },
          text: trip.actionLabel || "\u6253\u958b\u884c\u7a0b"
        })
      ])
    ]);
  }

  function formatTripMeta(trip) {
    return [
      trip.days ? `${trip.days} \u5929` : "",
      trip.nights ? `${trip.nights} \u591c` : "",
      trip.base ? `\u57fa\u5730\uff1a${trip.base}` : "",
      trip.updated ? `\u66f4\u65b0\uff1a${trip.updated}` : ""
    ].filter(Boolean);
  }

  function renderWelcome(welcome) {
    const copy = create("div", { className: "welcome-copy" }, [
      create("div", { className: "kicker", text: welcome.kicker }),
      create("h2", { text: welcome.title }),
      create("div", { className: "welcome-rule" }),
      create("p", { text: welcome.body })
    ]);

    const map = create("div", {
      className: "map-visual local-map official-map-set",
      attrs: { "aria-label": welcome.mapLabel || "" }
    }, (welcome.maps || []).map(item =>
      create("div", { className: "official-map-panel" }, [
        create("img", { attrs: { src: item.src, alt: item.alt } })
      ])
    ));

    return create("section", { id: welcome.id, className: "welcome-fukuoka" }, [
      create("div", { className: "welcome-layout" }, [copy, map])
    ]);
  }

  function renderPrep(prep) {
    return create("section", { id: prep.id }, [
      renderSectionHead(prep),
      create("div", { className: "grid grid-3" }, prep.cards.map(renderInfoCard)),
      create("div", { className: "card", style: { marginTop: "18px" } }, [
        create("h3", { text: prep.checklistTitle }),
        renderTable(prep.checklist)
      ])
    ]);
  }

  function renderOverview(overview) {
    return create("section", { id: overview.id }, [
      renderSectionHead(overview),
      create("div", { className: "card" }, [
        create("h3", { text: overview.tableTitle }),
        create("div", { className: "table-wrap" }, [renderTable(overview.table)])
      ]),
      create("div", { className: "grid grid-3", style: { marginTop: "18px" } },
        overview.cards.map(card => renderInfoCard(card, true))
      )
    ]);
  }

  function renderDay(day) {
    const children = [
      create("div", { className: "day-head" }, [
        create("div", {}, [
          create("span", { className: "day-num", text: day.number }),
          create("h2", { text: day.title }),
          create("p", { className: "tagline", text: day.tagline }),
          renderRoute(day.route)
        ]),
        create("div", { className: "day-media-row" }, [
          create("div", {}, [
            create("img", {
              className: "hero-img",
              attrs: {
                src: day.heroImage?.src || "",
                alt: day.heroImage?.alt || ""
              }
            })
          ]),
          renderMap(day)
        ])
      ])
    ];

    if (day.callout) {
      children.push(renderCallout(day.callout));
    }

    children.push(
      create("div", { className: "grid grid-2" }, [
        create("div", { className: "card" }, [
          create("h3", { text: day.scheduleTitle || "時間配置" }),
          renderTable(day.schedule)
        ])
      ]),
      create("div", { className: "detail-list" }, day.spots.map(renderSpot))
    );

    if (day.details) {
      children.push(create("details", {}, [
        create("summary", { text: day.details.summary }),
        create("p", { text: day.details.body })
      ]));
    }

    return create("section", { id: day.id, className: "day" }, children);
  }

  function renderFood(food) {
    const children = [
      renderSectionHead(food),
      create("div", { className: "food-grid" }, food.cards.map(renderFoodCard))
    ];

    if (food.extra) {
      children.push(create("div", { className: "card", style: { marginTop: "18px" } }, [
        create("h3", { text: food.extra.title }),
        create("p", { text: food.extra.body })
      ]));
    }

    return create("section", { id: food.id }, children);
  }

  function renderSources(sources) {
    return create("section", { id: sources.id }, [
      renderSectionHead(sources),
      create("div", { className: "card" }, [
        create("ul", { className: "source-list" }, sources.links.map(link =>
          create("li", {}, [
            create("a", {
              attrs: {
                href: link.url,
                target: "_blank",
                rel: "noopener"
              },
              text: link.text
            })
          ])
        ))
      ])
    ]);
  }

  function renderModals(modals) {
    const root = document.getElementById("modalRoot");
    root.replaceChildren(...modals.map(renderModal));
    state.modalContents = Array.from(root.querySelectorAll(".modal-content"));
  }

  function renderModal(modal) {
    const titleId = `modalTitle-${modal.id}`;
    return create("article", {
      className: "modal-content",
      id: `modal-${modal.id}`,
      attrs: { hidden: "" }
    }, [
      create("button", {
        className: "modal-close",
        attrs: {
          type: "button",
          "aria-label": "關閉"
        },
        text: "\u00d7"
      }),
      create("div", { className: "modal-hero" }, [
        create("img", {
          attrs: {
            src: modal.heroImage?.src || "",
            alt: modal.heroImage?.alt || ""
          }
        })
      ]),
      create("div", { className: "modal-body" }, [
        create("div", { className: "modal-kicker", text: modal.kicker }),
        create("h2", { id: titleId, className: "modal-title", text: modal.title }),
        create("p", { className: "modal-subtitle", text: modal.subtitle }),
        create("div", { className: "modal-meta" }, modal.meta.map(item =>
          create("span", { text: item })
        )),
        create("div", { className: "modal-layout" }, [
          create("div", { className: "modal-article" }, [
            create("div", { className: "gallery" }, modal.gallery.map(image =>
              create("img", { attrs: { src: image.src, alt: image.alt } })
            )),
            ...modal.paragraphs.map(text => create("p", { text }))
          ]),
          create("aside", { className: "modal-side" }, [
            create("h4", { text: modal.side.title }),
            create("p", { text: modal.side.body }),
            create("h4", { text: modal.side.pointsTitle }),
            create("ul", {}, modal.side.points.map(point =>
              create("li", { text: point })
            ))
          ])
        ])
      ])
    ]);
  }

  function bindModalControls() {
    const overlay = document.getElementById("modalOverlay");
    const modalRoot = document.getElementById("modalRoot");

    document.addEventListener("click", event => {
      const button = event.target.closest("[data-modal]");

      if (button) {
        openModal(button.getAttribute("data-modal"));
        return;
      }

      if (event.target.classList.contains("modal-close")) {
        closeModal();
        return;
      }

      if (event.target === overlay) {
        closeModal();
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && overlay.classList.contains("is-open")) {
        closeModal();
      }
    });

    function openModal(id) {
      state.lastFocus = document.activeElement;
      state.modalContents.forEach(content => {
        content.hidden = true;
      });

      const target = document.getElementById(`modal-${id}`);
      if (!target) {
        return;
      }

      target.hidden = false;
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      modalRoot.setAttribute("aria-labelledby", target.querySelector(".modal-title")?.id || "");
      document.body.style.overflow = "hidden";
      target.querySelector(".modal-close")?.focus();
    }

    function closeModal() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      state.modalContents.forEach(content => {
        content.hidden = true;
      });

      if (state.lastFocus && typeof state.lastFocus.focus === "function") {
        state.lastFocus.focus();
      }
    }
  }

  function renderSectionHead(section) {
    const children = [
      create("div", {}, [
        create("div", { className: "kicker", text: section.kicker }),
        create("h2", { text: section.title })
      ])
    ];

    if (section.note) {
      children.push(create("p", { className: "note", text: section.note }));
    }

    return create("div", { className: "section-head" }, children);
  }

  function renderInfoCard(card, compact) {
    const children = [];

    if (card.number) {
      children.push(create("div", { className: "big-num", text: card.number }));
    }

    children.push(
      create("h3", { text: card.title }),
      ...card.paragraphs.map(text => create("p", { text }))
    );

    if (card.route?.length) {
      children.push(renderRoute(card.route));
    }

    return create("div", { className: compact ? "card compact" : "card" }, children);
  }

  function renderFoodCard(card) {
    return create("div", { className: "card food-card" }, [
      create("img", {
        attrs: {
          src: card.image?.src || "",
          alt: card.image?.alt || ""
        }
      }),
      create("div", { className: "food-card-body" }, [
        create("h3", { text: card.title }),
        create("p", { text: card.body }),
        create("div", { className: "food-note" }, card.notes.map(note =>
          create("div", {}, [
            create("b", { text: note.label }),
            document.createTextNode(note.text)
          ])
        ))
      ])
    ]);
  }

  function renderSpot(spot) {
    return create("div", { className: "spot" }, [
      create("img", {
        attrs: {
          src: spot.image?.src || "",
          alt: spot.image?.alt || ""
        }
      }),
      create("div", {}, [
        create("h3", { className: "spot-title" }, [
          create("button", {
            attrs: {
              type: "button",
              "data-modal": spot.modalId
            },
            text: spot.title
          })
        ]),
        ...spot.paragraphs.map(text => create("p", { text })),
        create("div", { className: "meta-line" }, spot.meta.map(item =>
          create("span", { className: "mini", text: item })
        ))
      ])
    ]);
  }

  function renderMap(day) {
    const mapUrl = getGoogleMapsUrl(day.mapEmbed);
    const title = `${day.number || ""} ${day.title || ""}`.trim();

    return create("div", { className: "mapbox" }, [
      create("iframe", {
        attrs: {
          title: `${title} 地圖`,
          loading: "eager",
          referrerpolicy: "no-referrer-when-downgrade",
          allowfullscreen: "",
          src: day.mapEmbed || ""
        }
      }),
      create("a", {
        className: "map-open-link",
        attrs: {
          href: mapUrl,
          target: "_blank",
          rel: "noopener"
        },
        text: "在 Google Maps 開啟"
      })
    ]);
  }

  function getGoogleMapsUrl(embedUrl) {
    if (!embedUrl) {
      return "https://www.google.com/maps";
    }

    try {
      const url = new URL(embedUrl);
      url.searchParams.delete("output");
      return url.toString();
    } catch {
      return embedUrl.replace(/([?&])output=embed&?/, "$1").replace(/[?&]$/, "");
    }
  }

  function renderRoute(items) {
    const children = [];

    items.forEach((item, index) => {
      if (index > 0) {
        children.push(create("b", { text: "\u2192" }));
      }
      children.push(create("span", { text: item }));
    });

    return create("div", { className: "route" }, children);
  }

  function renderCallout(callout) {
    return create("div", { className: "callout" }, [
      create("b", { text: callout.label }),
      document.createTextNode(callout.text)
    ]);
  }

  function renderTable(table) {
    const headRow = create("tr", {}, (table.headers || []).map(header =>
      create("th", { text: header })
    ));

    const bodyRows = (table.rows || []).map(row =>
      create("tr", {}, row.map(cell => create("td", { text: cell })))
    );

    return create("table", { className: "table" }, [headRow, ...bodyRows]);
  }

  function renderTitle(tagName, title) {
    const titleEl = create(tagName);
    const lines = Array.isArray(title) ? title : [title];

    lines.forEach((line, index) => {
      if (index > 0) {
        titleEl.append(create("br"));
      }
      titleEl.append(document.createTextNode(line));
    });

    return titleEl;
  }

  function renderLoadError(error) {
    const main = document.getElementById("app");
    main.replaceChildren(create("section", {}, [
      create("div", { className: "card" }, [
        create("h2", { text: "Unable to load trip data" }),
        create("p", { text: error.message }),
        create("p", {
          text: "Start a local static server, then open this page through http://localhost instead of file://."
        })
      ])
    ]));
  }

  function create(tagName, options = {}, children = []) {
    const element = document.createElement(tagName);
    const childList = Array.isArray(children) ? children : [children];

    if (options.id) {
      element.id = options.id;
    }

    if (options.className) {
      element.className = options.className;
    }

    if (options.text !== undefined) {
      element.textContent = options.text;
    }

    if (options.attrs) {
      Object.entries(options.attrs).forEach(([key, value]) => {
        if (value === false || value === null || value === undefined) {
          return;
        }

        element.setAttribute(key, value === true ? "" : String(value));
      });
    }

    if (options.style) {
      Object.assign(element.style, options.style);
    }

    childList.filter(Boolean).forEach(child => {
      element.append(child);
    });

    return element;
  }
})();
