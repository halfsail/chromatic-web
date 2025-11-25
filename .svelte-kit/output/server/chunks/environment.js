const version = "0.1.2";
let prerendering = false;
function set_building() {
}
function set_prerendering() {
  prerendering = true;
}
export {
  set_prerendering as a,
  prerendering as p,
  set_building as s,
  version as v
};
