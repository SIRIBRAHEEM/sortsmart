// Waste item database for SortSmart.
// Categories: Recyclable, Organic, Hazardous, General.
// "how" tells the user what to do with the item, "why" says why in one line.
// Categories follow what is actually possible in Nigeria: recyclable means a
// buy-back centre, waste collector or scrap dealer will take it.

export const CATEGORIES = ["Recyclable", "Organic", "Hazardous", "General"];

export const ITEMS = [
  // ---- Recyclable ----
  {
    name: "Plastic water bottle",
    category: "Recyclable",
    how: "Rinse it, remove the cap, and put it in the recycling bag. Sell to a buy-back centre or give to your waste collector.",
    why: "PET plastic is one of the easiest materials to recycle, and collectors pay for it by weight.",
  },
  {
    name: "Soft drink bottle",
    category: "Recyclable",
    how: "Rinse it and put it in the recycling bag. Same as a water bottle.",
    why: "PET plastic can be melted down and made into new bottles and fibres.",
  },
  {
    name: "Pure water sachet (empty)",
    category: "Recyclable",
    how: "Shake out the water, tie the sachets together and sell them to a recycler or give them to your waste collector.",
    why: "Sachet nylon is collected and recycled into new plastic products in Nigeria.",
  },
  {
    name: "Sachet water outer bag",
    category: "Recyclable",
    how: "Keep it dry and add it to your recycling bag.",
    why: "It is the same nylon as the sachets, so recyclers take it too.",
  },
  {
    name: "Plastic bucket or basin",
    category: "Recyclable",
    how: "Wash it and put it aside for the recycler. Hard plastics are bought by weight.",
    why: "Hard HDPE plastic is valuable scrap and is remoulded into new buckets and containers.",
  },
  {
    name: "Broken plastic chair",
    category: "Recyclable",
    how: "Give it to a scrap dealer or your waste collector. Do not burn it.",
    why: "Burning plastic chairs releases smoke that is bad for your lungs and the air.",
  },
  {
    name: "Aluminium drink can",
    category: "Recyclable",
    how: "Rinse it, crush it flat, and put it in the recycling bag.",
    why: "Aluminium is worth money as scrap and can be recycled again and again.",
  },
  {
    name: "Tin can (milk, tomato paste)",
    category: "Recyclable",
    how: "Rinse out the food, let it dry, and put it in the recycling bag.",
    why: "Steel and tin cans are bought as scrap metal.",
  },
  {
    name: "Glass bottle (beer or soft drink)",
    category: "Recyclable",
    how: "Return it to the seller for a deposit if they take empties. Otherwise put it in the recycling bag, unbroken.",
    why: "Glass never wears out. Returned bottles are washed and reused, or crushed and remade.",
  },
  {
    name: "Glass jar (jam, mayonnaise)",
    category: "Recyclable",
    how: "Wash it out and put it in the recycling bag. You can also reuse it at home for storing things.",
    why: "Glass can be recycled forever without losing quality.",
  },
  {
    name: "Old newspaper",
    category: "Recyclable",
    how: "Keep it dry, tie it in a bundle, and give it to a recycler or paper collector.",
    why: "Wet paper is hard to recycle, but dry newspaper is turned into new paper.",
  },
  {
    name: "Cardboard box",
    category: "Recyclable",
    how: "Flatten the box and keep it dry, then put it in the recycling bag.",
    why: "Cardboard is made from recycled paper and can be recycled again.",
  },
  {
    name: "Old notebooks and office paper",
    category: "Recyclable",
    how: "Remove staples if you can, tie the papers together, and give them to a paper collector.",
    why: "Clean paper is easy to recycle into new paper products.",
  },
  {
    name: "Paper egg crate",
    category: "Recyclable",
    how: "Keep it dry and add it to your paper recycling.",
    why: "It is made from recycled paper pulp and can be recycled again.",
  },
  {
    name: "Old metal pot",
    category: "Recyclable",
    how: "Give it to a scrap metal dealer. Aluminium and steel pots are bought by weight.",
    why: "Scrap metal is melted down and used to make new metal goods.",
  },
  {
    name: "Old zinc roofing sheet",
    category: "Recyclable",
    how: "Give it to a scrap dealer. Do not leave it to rust in the compound.",
    why: "Zinc and iron sheets are valuable scrap metal.",
  },
  {
    name: "Plastic shopping bag",
    category: "Recyclable",
    how: "Reuse it first. When it tears, add it to the recycling bag.",
    why: "Thin plastic bags take many years to break down, so recycling them keeps them out of drains and gutters.",
  },

  // ---- Organic / compost ----
  {
    name: "Yam peels",
    category: "Organic",
    how: "Put them in the compost heap or bury them in the garden. Do not put them in the recycling bag.",
    why: "Yam peels rot down into rich soil for planting.",
  },
  {
    name: "Cassava peels",
    category: "Organic",
    how: "Compost them or bury them. Dry them first if you keep goats or pigs away from fresh peels.",
    why: "Cassava peels break down into compost, but fresh peels are not safe for animals to eat.",
  },
  {
    name: "Plantain peels",
    category: "Organic",
    how: "Put them in the compost heap.",
    why: "They rot quickly and feed the soil.",
  },
  {
    name: "Banana peels",
    category: "Organic",
    how: "Put them in the compost heap or bury them near plants.",
    why: "Banana peels add potassium to the soil.",
  },
  {
    name: "Orange peels",
    category: "Organic",
    how: "Put them in the compost heap.",
    why: "They break down slowly but still make good compost.",
  },
  {
    name: "Leftover cooked food",
    category: "Organic",
    how: "Put it in the compost heap or feed it to animals if it is still safe. Do not pour it in the gutter.",
    why: "Food waste in gutters blocks drains and brings rats.",
  },
  {
    name: "Vegetable scraps (ugu, onion, pepper)",
    category: "Organic",
    how: "Put them in the compost heap.",
    why: "Soft vegetable scraps rot fast and make good compost.",
  },
  {
    name: "Eggshells",
    category: "Organic",
    how: "Crush them and add them to the compost heap or garden soil.",
    why: "Crushed eggshells add calcium to the soil.",
  },
  {
    name: "Corn cobs and husks",
    category: "Organic",
    how: "Compost them or dry them and use them as firewood. Do not dump them in the gutter.",
    why: "Corn waste rots down into compost, or burns cleanly when dry.",
  },
  {
    name: "Groundnut shells",
    category: "Organic",
    how: "Put them in the compost heap or use them as mulch around plants.",
    why: "They break down slowly and help the soil hold water.",
  },
  {
    name: "Mango seeds and fruit waste",
    category: "Organic",
    how: "Put them in the compost heap or bury them.",
    why: "Fruit waste rots into compost. You can also plant the seed.",
  },
  {
    name: "Tea leaves",
    category: "Organic",
    how: "Throw them in the compost heap.",
    why: "Tea leaves add nitrogen to compost.",
  },
  {
    name: "Garden leaves and grass cuttings",
    category: "Organic",
    how: "Pile them in the compost heap or use them as mulch.",
    why: "Leaves and grass rot into rich soil.",
  },
  {
    name: "Sawdust",
    category: "Organic",
    how: "Mix a little into the compost heap. Do not use sawdust from painted or treated wood.",
    why: "Plain sawdust breaks down and helps the compost breathe.",
  },
  {
    name: "Hair from combing or barbing",
    category: "Organic",
    how: "Put it in the compost heap.",
    why: "Hair breaks down slowly and adds nitrogen to the soil.",
  },
  {
    name: "Wood ash (small amounts)",
    category: "Organic",
    how: "Sprinkle a little on the compost heap or garden. Do not dump a large pile in one place.",
    why: "Wood ash adds potassium to the soil, but too much makes the soil too alkaline.",
  },

  // ---- Hazardous ----
  {
    name: "Old battery (AA, AAA, phone battery)",
    category: "Hazardous",
    how: "Keep it in a sealed container and take it to a phone repair shop, electronics shop, or e-waste collection point. Never throw it in the normal bin.",
    why: "Batteries leak acid and heavy metals that poison soil and water.",
  },
  {
    name: "Used engine oil",
    category: "Hazardous",
    how: "Pour it into a sealed bottle and take it to a mechanic or oil collection point. Never pour it on the ground or in a drain.",
    why: "One litre of engine oil can pollute a large amount of water and soil.",
  },
  {
    name: "Expired medicine",
    category: "Hazardous",
    how: "Take it back to a pharmacy or hospital. Do not throw it in the bin or flush it down the toilet.",
    why: "Old drugs in water or soil can harm people and animals.",
  },
  {
    name: "Broken fluorescent bulb",
    category: "Hazardous",
    how: "Wrap the pieces carefully in paper, put them in a sealed bag, and take them to an e-waste collection point.",
    why: "These bulbs contain a small amount of mercury, which is poisonous.",
  },
  {
    name: "Old phone or charger",
    category: "Hazardous",
    how: "Take it to a phone repair shop or an e-waste collector. Many shops buy old phones for parts.",
    why: "Phones contain batteries and metals that should not go into a landfill.",
  },
  {
    name: "Leftover paint",
    category: "Hazardous",
    how: "Seal the can tightly and take it to a paint shop or hazardous waste collection point.",
    why: "Paint contains chemicals that poison soil and water.",
  },
  {
    name: "Pesticide or insecticide container",
    category: "Hazardous",
    how: "Rinse it three times, keep it away from children, and take it to an agro-chemical dealer or collection point. Never reuse it to store food or water.",
    why: "Even an empty pesticide container can still poison food and water.",
  },
  {
    name: "Used syringe or needle",
    category: "Hazardous",
    how: "Put it in a strong sealed container (like a plastic bottle with a lid) and take it to a hospital or clinic for safe disposal.",
    why: "Used needles can spread disease if someone gets pricked by them.",
  },
  {
    name: "Nail polish remover",
    category: "Hazardous",
    how: "Keep the bottle sealed and take it to a hazardous waste collection point. Do not pour it down the drain.",
    why: "It contains strong chemicals that harm water and soil.",
  },

  // ---- General waste ----
  {
    name: "Used tissue paper",
    category: "General",
    how: "Put it in the general waste bin. It cannot be recycled because it is dirty and too thin.",
    why: "Used tissue is contaminated, so recyclers cannot use it.",
  },
  {
    name: "Disposable diaper",
    category: "General",
    how: "Wrap it tightly in a nylon bag and put it in the general waste bin.",
    why: "Diapers cannot be recycled. Wrapping them keeps smells and germs down.",
  },
  {
    name: "Sanitary pad",
    category: "General",
    how: "Wrap it well and put it in the general waste bin.",
    why: "Sanitary products cannot be recycled or composted.",
  },
  {
    name: "Broken ceramic plate or cup",
    category: "General",
    how: "Wrap the pieces in old newspaper so nobody gets cut, then put it in the general waste bin.",
    why: "Ceramics melt at a different temperature from glass, so they cannot go in the glass recycling.",
  },
  {
    name: "Broken mirror",
    category: "General",
    how: "Wrap the pieces carefully and put them in the general waste bin.",
    why: "Mirror glass has a coating on it, so recyclers cannot use it like normal glass.",
  },
  {
    name: "Old foam mattress or sponge",
    category: "General",
    how: "Put it in the general waste bin, or give it to a waste collector. Do not burn it.",
    why: "Foam burns with thick black smoke and does not break down in soil.",
  },
  {
    name: "Used toothbrush",
    category: "General",
    how: "Put it in the general waste bin.",
    why: "Toothbrushes are made from mixed plastics that recyclers do not take.",
  },
  {
    name: "Styrofoam food pack",
    category: "General",
    how: "Put it in the general waste bin. Rinse off food first if you can.",
    why: "Styrofoam is almost never recycled in Nigeria and breaks into tiny pieces that spread everywhere.",
  },
  {
    name: "Cling film (food wrap)",
    category: "General",
    how: "Put it in the general waste bin.",
    why: "Cling film is too thin and dirty for recyclers to use.",
  },
  {
    name: "Cigarette butt",
    category: "General",
    how: "Put it in the general waste bin. Never throw it on the ground or in a gutter.",
    why: "Cigarette filters are made of plastic and leak chemicals into the soil.",
  },
  {
    name: "Worn-out slippers or shoes",
    category: "General",
    how: "If they are still wearable, give them away. If they are torn, put them in the general waste bin.",
    why: "Worn-out shoes are made from mixed materials that recyclers do not take.",
  },
  {
    name: "Chewing gum",
    category: "General",
    how: "Wrap it in paper and put it in the general waste bin.",
    why: "Chewing gum is made from plastic-like rubber and does not break down.",
  },
];

export function searchItems(query, category) {
  const q = query.trim().toLowerCase();
  return ITEMS.filter((item) => {
    const matchesQuery = q === "" || item.name.toLowerCase().includes(q);
    const matchesCategory = category === "All" || item.category === category;
    return matchesQuery && matchesCategory;
  });
}
