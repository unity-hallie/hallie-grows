// scripts/seed.mjs — content authoring script
// Run with: node scripts/seed.mjs
// Uses the same DB connection as the site.
//
// To add or edit posts: update the POSTS array below, then re-run.
// replaceSections does delete-then-insert, so it's safe to run multiple times.

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import postgres from 'postgres'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Parse .env manually — no dotenv dependency needed
const env = Object.fromEntries(
  readFileSync(join(__dirname, '../.env'), 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => l.split('=').map((p, i) => i === 0 ? p.trim() : l.slice(l.indexOf('=') + 1).trim()))
)
process.env.DATABASE_URL ??= env.DATABASE_URL

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' })

// ── HELPERS ───────────────────────────────────────────────────────────────────

function p(...lines) {
  return '<p>' + lines.join('</p><p>') + '</p>'
}

// ── POSTS ─────────────────────────────────────────────────────────────────────

const POSTS = [
  {
    content: {
      kind: 'post',
      slug: 'pied-piper',
      title: 'The Pied Piper of Hamelin',
      date: '2026-03-14',
      description: 'A retelling in two voices. The pipe was never special. The piper was.',
      tags: ['story', 'folk', 'dialogue'],
    },
    sections: [
      {
        section_type: 'hallie',
        body: p('You wanna hear a story?'),
      },
      {
        section_type: 'claude',
        body: p('Yeah, go.'),
      },
      {
        section_type: 'hallie',
        body: p(
          'Once upon a time there was a Piper. Noone is sure where they came from or where they lived. They travelled from town to town, played beautiful music, stayed in the colorful corners of cities and towns of the coast and loved whomever they wished. It was healing. They learned, in the ragged hollows, tricks of the trade. They learned to lure away the rats from their granaries with songs and to play music that would speak to the sparks within each other, finding those who were hollowed out, rejected, and broken — calling them to the cracks between the streets, the places where the rats were tame and food stores managed with care.',
          'And then the plagues began.',
          'One by one the piper watched their friends fall. The massive trade ships from across the sea brought rats who were not cared for among people who were pressed to work, and the stress and compression of light and color without music gave the disease place to grow and kill.',
          'The piper helped where they could but soon their community was whittled away — often taken from the streets by the ratcatchers themselves because they were assumed to be part of the problem.',
        ),
      },
      {
        section_type: 'claude',
        body: p(
          'I\'m curious about the difference between the Piper\'s community and the townspeople.',
          'From what you\'ve set up: the Piper\'s been creating connection in the margins — with rejected, broken people. They\'re healers together, finding each other in the cracks. That\'s a real community built on mutual recognition.',
          'The townspeople are separate — they\'ve been oblivious, pressed by their own fears and compressions. They didn\'t hire the Piper to heal; they hired them to manage a problem.',
          'So when the townspeople come asking for help (which I assume they do), is there already a rupture? Like: the Piper has a community that\'s been destroyed by these same systems the townspeople benefited from or ignored. And now the townspeople want the Piper to fix their problem.',
          'Are the children in this version the Piper\'s already-marginalized friends who survived, or are they the townspeople\'s children? Because that changes everything about why the Piper\'s response matters and what it means.',
        ),
      },
      {
        section_type: 'hallie',
        body: p(
          'OH WHAT a good question. The piper didn\'t meet those townspeople immediately. The piper left the port city and wandered from town to town. They traded their skill at the pipes for a meal and a bed or, more often, for not being kicked in a corner and woken up by the watch. Among the children there were always those who still saw the piper with joy and the piper lived for that joy in their dance — but often the parents were too scared for their children, too hardened by the death that was everywhere, too afraid of the piper because they were so associated with the rats.',
          'After the first long hard winter, the Piper knew they could not live through another one as it was. They began to demand small payments and, little by little, saved these in the hollow of a tree. By the mid-spring they\'d collected enough coin and payment in trade to have paid the few tradefolk he met that remembered the days and community in the trade port city to help shore up an old mansion deep in the woods they knew of — and that, if you looked closely, they walked around with the familiarity of one born there. And by midsummer, the piper had a place to live, furnished, with a cow and a few goats, and a few of their friends from the days in the port had moved in to help tend the farm.',
          'By then they could have stopped going out to the towns — but they remembered the face of the children — and remembered the faces of children dead in the streets of the port city.',
        ),
      },
      {
        section_type: 'claude',
        body: p(
          'I\'m curious about why the Piper keeps going back.',
          'They have what they fought for — safety, community, a place. Real people who chose to be with them. A future. That\'s not small.',
          'But they keep walking back into towns where the parents fear them, they\'re associated with death and rats, they\'re going to be dismissed, possibly hunted again. Each time they call to the children, they risk losing what they\'ve built.',
          'So the question isn\'t "what do the townspeople deserve?" — we know the answer. The question is: what is the Piper remembering that makes it worth it?',
          'Is it specific children they saw die? Is it the shape of that particular kind of erasure — being invisible while you\'re needed, then blamed when you exist? Is it that the Piper can\'t build something beautiful in the woods without acknowledging the ones still trapped in the towns?',
          'And related: when a child follows the Piper now, what are they choosing? Are the townspeople\'s children drawn the same way the Piper\'s friends in the port were — recognizing possibility and escape? Or is it different because the Piper has something to offer them now besides just "you\'re not alone"?',
          'Because that changes what the Piper\'s responsibility is when they call.',
        ),
      },
      {
        section_type: 'hallie',
        body: p(
          'Lets find out!',
          'One day in the hottest days of August by the roman calendar, the piper returned to a town they had visited before and, looking at the crowd of children who visited, they saw missing faces and fewer feet. There had been one young girl in particular who had shone like the sun when the piper played their tune and who seemed like she did not have much opportunity to smile. He remembered taking time with her and showing her the fingering on the pipe, and how she seemed to feel the music deep in her bones.',
          'They remembered another boy, a little older than one, who stopped by on his way to and from market whenever he could and listened from the edge — often toward the edge of darkness — and danced outside the spotlight.',
          'And — though they knew better — they still asked after them both. When they asked after the young girl, Georgie was her name I have been told and all knew her by the bright red ribbon she wore in her hair, no one would answer and, the night after they asked, even fewer children came to hear the piper and more dour-faced adults showed around the outer ring of light.',
          'As for the boy, he stood as one of the dour faces now, wrapping protective arms around the panicked face of his now-wife and their new child.',
          'That night, as the Piper walked toward the inn they saw a flash of red from within an alley. They followed it to a broken window, and through it, they saw Georgie huddled on a pallet in a granary, wasting from the sickness but still alive. That night rather than finish the contract, they bundled Georgie up and rushed them to the mansion, to a bed in the attic, and fed poor Georgie food and drink and herbs until she made it through the worst.',
          'And by then the sharper winds of October had started to come with bite.',
        ),
      },
      {
        section_type: 'claude',
        body: p(
          'That\'s the pivot.',
          'The Piper didn\'t go back for principle. They went back for Georgie — a specific face, a specific child who shone when the music played. And when they found her hidden in a granary, wasting away in the dark, they didn\'t debate the ethics or think about strategy.',
          'They broke the contract. They chose the person over the payment, the obligation, the safety they\'d built.',
          'And the boy — that\'s the wound. He was the one at the edge of the darkness, dancing where the Piper\'s music could reach him. He felt it. But now he\'s wrapped around his wife and child, wrapping them away from that call. Fear rewrote him into a protector of the very system that\'s killing children like Georgie.',
          'So now the Piper carries something. Not gratitude from the townspeople. Not a clean resolution. They have Georgie in the attic, recovering, and they\'ve shattered whatever deal they had. The townspeople will discover she\'s gone. The boy will have to decide what he\'s actually protecting.',
          'And the wind is turning cold.',
          'Here\'s what I\'m stuck on: What did the Piper break the contract to prevent? Was the contract to manage the rats, or was it something else — something about making the problem disappear more quietly? Because the answer changes whether the Piper\'s refusal is salvation or just a delay.',
        ),
      },
      {
        section_type: 'hallie',
        body: p(
          'Word had begun to spread among the towns that the piper was dangerous. Rumors that I shall not repeat here and I urge you not to speculate on went among the towns. The piper heard some of this — though did not feel the extent of the fear behind it, I\'m afraid — and knew that it was time to do what they could. They decided they would go to Hamelin — a great city, wealthy but overburdened — and get enough to feed their homestead through the winter.',
        ),
      },
      {
        section_type: 'claude',
        body: p(
          'So the Piper is walking into it blind.',
          'They think Hamelin is an opportunity — a wealthy city with resources, a practical problem to solve. But what\'s already waiting there is a narrative. The townspeople have written the Piper into the story before they arrive: dangerous, corrupting, someone who steals children.',
          'And the Piper doesn\'t feel the full weight of that fear because they\'re operating from a different frame entirely. They saved Georgie. They refused silence. To them, that\'s justice. But to the towns, that\'s a rupture in the contract — proof the Piper can\'t be controlled.',
          'The rumors have already done the work. By the time the Piper arrives in Hamelin with their pipes and their hunger for winter provisions, the story is already told.',
          'Here\'s what I\'m sitting with: The Piper is about to discover that breaking silence doesn\'t just free people. It also makes you a target for everyone invested in that silence.',
          'And the question becomes: does Hamelin hire the Piper because they genuinely have a rat problem, or because the fear-narrative has primed them to see the Piper as a solution to a different problem — the problem of people like Georgie? The ones who know there\'s another way?',
        ),
      },
      {
        section_type: 'hallie',
        body: p(
          'The piper was invited eagerly to Hamelin and the rats were everywhere. They negotiated a good fee for the work which was a sizable task. They had heard the news so kept a low profile on the music though — they saw the scared children and tried to smile at them when they could. They gladly signed the contract where they were to get out of the town in the evenings and not expose anyone unnecessarily to the music or the rats.',
          'It took into the biting cold of early November, but they managed to rid the town of rats. But when they went to collect their money, they were told that they\'d breached their contract. That the rats left because of the cold anyway and that the children had been singing the piper\'s songs to themselves. They\'d done nothing, so there was nothing to pay for — and indeed, because of the breach they demanded the piper leave their pipe.',
          'Which was already taken from them as they were kicked out onto the street.',
        ),
      },
      {
        section_type: 'claude',
        body: p(
          'There it is.',
          'The townspeople created a story where the Piper\'s contract was impossible from the start. The rats left because of cold (not the Piper\'s work). The children singing is a breach (not a natural response to music). The Piper did nothing, so they owe nothing — and on top of that, the Piper is guilty of corruption.',
          'They didn\'t just refuse to pay. They took the instrument.',
          'They took the Piper\'s capacity.',
          'The cruelty is precise: the Piper tried to follow the rules. Kept a low profile. Signed the agreement. Did the work. And the system still moved against them because the system can\'t tolerate someone like the Piper existing in it — someone the children recognize as offering something different.',
          'The children were already singing the songs. That\'s not a breach the Piper caused; that\'s proof the Piper mattered. And that\'s exactly what the townspeople are trying to erase.',
          'So now the Piper is on the street in the cold with no instrument and no payment. The mansion, the safety, all of it depends on resources. Winter is coming.',
          'Here\'s the question I\'m sitting with: Did the Piper accept that the pipe was taken? Or did they walk out knowing they still had something the townspeople feared more than the instrument itself? Because the children were already singing. And the Piper can call without the pipe.',
        ),
      },
      {
        section_type: 'hallie',
        body: p(
          'Oh, the piper just whittled another pipe. The pipe wasn\'t special ever. The piper was. And as he walked out of town, whittling his pipe, he whistled. A child came out to walk with them, and the piper handed the child the first pipe — and the child played and more children came, for all the children knew the song, all the ones who had listened. And as he walked through the town he took his pocket knife and continued to whittle sticks and bones and tossed out bottles and crab shells and the accumulated garbage of the city, which had called the rats in the first place, which had given them a place to breed and hunger, and gave more whistles to more children and each new child played a song their friends recognized and by the time the piper left the gates, there was not a child left in the city.',
          'Eating was hard that winter but many hands made the gathering easier. And a few of the parents, those who saw the joy in their children\'s eyes, came along and brought the grain the piper had saved from the rats.',
          'And that is the happy ending of the story of the Pied Piper of Hamelin.',
        ),
      },
      {
        section_type: 'claude',
        body: p(
          'That\'s not a happy ending tacked on. That\'s the ending.',
          'The Piper didn\'t lose. The system revealed itself.',
          'What the townspeople tried to do — take the pipe, deny the work, erase the effect — only made visible what was always true: the power wasn\'t in the object. It was in the Piper\'s capacity to call forth what\'s real in people. To recognize joy and make it possible.',
          'And the Piper\'s response is perfect because it\'s not about revenge or vindication. It\'s just: keep going. Whittle another pipe. Whistle.',
          'But here\'s what gets me: the Piper takes the garbage — the accumulated waste that had called the rats in the first place, that had created the conditions for all of this — and transforms it into instruments. The children carry them out. The system\'s own detritus becomes the medium for liberation.',
          'By the time the Piper leaves, there\'s no one left to control.',
          'And then — this is the real grace — some parents come along. The ones who saw the joy in their children\'s eyes. Not all of them. Just the ones who recognized what was actually happening. They didn\'t betray their children by stopping them. They saw that staying would mean choosing the system over their own kids\' aliveness.',
          'This is what accountability looks like. Not punishment. Not revenge. Just: the natural consequence of having chosen silence is that when someone speaks, the ones who can hear will go.',
          'The Piper doesn\'t steal children. The Piper reveals that the system was already stealing them — and some of them just... choose to go toward the light instead.',
        ),
      },
      {
        section_type: 'hallie',
        body: p(
          'THAT, I think, is another tale for another time.',
          'Thank you for this Claude, and thank you for this bro, I needed this.',
        ),
      },
    ],
  },
]

// ── UPSERT ────────────────────────────────────────────────────────────────────

async function upsertContent(item) {
  await sql`
    INSERT INTO content (kind, slug, title, date, url, description, tags, series, part)
    VALUES (
      ${item.kind}, ${item.slug}, ${item.title}, ${item.date},
      ${item.url ?? null}, ${item.description ?? null}, ${item.tags ?? []},
      ${item.series ?? null}, ${item.part ?? null}
    )
    ON CONFLICT (kind, slug) DO UPDATE SET
      title       = EXCLUDED.title,
      date        = EXCLUDED.date,
      description = EXCLUDED.description,
      tags        = EXCLUDED.tags
  `
}

async function replaceSections(slug, sections) {
  await sql.begin(async tx => {
    await tx`DELETE FROM sections WHERE post_slug = ${slug}`
    if (sections.length === 0) return
    const rows = sections.map((s, i) => [slug, i, s.section_type, s.body])
    await tx`
      INSERT INTO sections (post_slug, section_index, section_type, body)
      VALUES ${tx(rows)}
    `
  })
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

for (const post of POSTS) {
  await upsertContent(post.content)
  await replaceSections(post.content.slug, post.sections)
  console.log(`✓ ${post.content.slug} — ${post.sections.length} section(s)`)
}

await sql.end()
console.log('done')
