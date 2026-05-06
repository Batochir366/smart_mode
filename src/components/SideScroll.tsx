import { useRef } from 'react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(Observer, useGSAP)

const SLIDES = [
    'Smart Medical Devices',
    'Portable Diagnostic Equipment',
    'Healthcare Solutions',
]

export function SideScroll() {
    const rootRef = useRef<HTMLDivElement | null>(null)

    useGSAP(() => {
        const root = rootRef.current
        if (!root) return

        const sections = gsap.utils.toArray<HTMLElement>('.slide')
        const images = gsap.utils.toArray<HTMLElement>('.bg')

        let index = 0
        let animating = false
        const last = sections.length - 1

        // initial states
        gsap.set(sections, { autoAlpha: 0 })
        gsap.set(sections[0], { autoAlpha: 1 })

        function gotoSection(next: number, direction: number) {
            if (animating || next === index) return
            if (next < 0 || next > last) return

            animating = true

            const fromTop = direction === -1
            const d = fromTop ? -1 : 1

            const tl = gsap.timeline({
                defaults: { duration: 0.8, ease: 'power2.inOut' },
                onComplete: () => (animating = false),
            })

            const current = index

            // hide current
            tl.to(images[current], { yPercent: -15 * d })
                .set(sections[current], { autoAlpha: 0 })

            // show next
            gsap.set(sections[next], { autoAlpha: 1, zIndex: 1 })

            tl.fromTo(
                images[next],
                { yPercent: 15 * d },
                { yPercent: 0 },
                0
            )

            tl.fromTo(
                sections[next].querySelector('.heading'),
                { y: 100 * d, opacity: 0 },
                { y: 0, opacity: 1 },
                0.2
            )

            index = next
        }

        // gesture control
        const observer = Observer.create({
            target: root,
            type: 'wheel,touch',
            wheelSpeed: -1,
            tolerance: 10,
            preventDefault: true,

            onUp: () => {
                if (index < last) gotoSection(index + 1, 1)
            },

            onDown: () => {
                if (index > 0) gotoSection(index - 1, -1)
            },
        })

        // pin section manually
        ScrollTrigger.create({
            trigger: root,
            start: 'top top',
            end: `+=${window.innerHeight * sections.length}`,
            pin: true,
        })

        return () => observer.kill()
    }, [])

    return (
        <section ref={rootRef} className="relative h-screen overflow-hidden bg-black">
            {SLIDES.map((text, i) => (
                <div
                    key={i}
                    className="slide absolute inset-0 flex items-center justify-center"
                >
                    <div
                        className="bg absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(https://picsum.photos/seed/${i}/1920/1080)`,
                        }}
                    />

                    <h2 className="heading relative text-white text-5xl font-bold">
                        {text}
                    </h2>
                </div>
            ))}
        </section>
    )
}