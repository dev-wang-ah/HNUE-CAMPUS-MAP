const WIDTH: usize = 272;
const CHUNK_SIZE: i32 = 256;
const MARGIN: i32 = 8;
const PIXELS: usize = WIDTH * WIDTH;
const TEXTURE_BYTES: usize = 9 * 32 * 32;

static mut TERRAIN: [u8; PIXELS] = [0; PIXELS];
static mut HEIGHT: [u8; PIXELS] = [0; PIXELS];
static mut TEXTURES: [u8; TEXTURE_BYTES] = [0; TEXTURE_BYTES];
static mut OUTPUT: [u8; PIXELS * 4] = [0; PIXELS * 4];

#[no_mangle]
pub extern "C" fn width() -> u32 {
    WIDTH as u32
}

#[no_mangle]
pub extern "C" fn chunk_size() -> u32 {
    CHUNK_SIZE as u32
}

#[no_mangle]
pub extern "C" fn margin() -> u32 {
    MARGIN as u32
}

#[no_mangle]
pub extern "C" fn terrain_ptr() -> *mut u8 {
    core::ptr::addr_of_mut!(TERRAIN).cast()
}

#[no_mangle]
pub extern "C" fn height_ptr() -> *mut u8 {
    core::ptr::addr_of_mut!(HEIGHT).cast()
}

#[no_mangle]
pub extern "C" fn texture_ptr() -> *mut u8 {
    core::ptr::addr_of_mut!(TEXTURES).cast()
}

#[no_mangle]
pub extern "C" fn output_ptr() -> *mut u8 {
    core::ptr::addr_of_mut!(OUTPUT).cast()
}

#[no_mangle]
pub extern "C" fn colorize(chunk_x: i32, chunk_y: i32) {
    unsafe {
        let terrain = core::ptr::addr_of!(TERRAIN).cast::<u8>();
        let height = core::ptr::addr_of!(HEIGHT).cast::<u8>();
        let textures = core::slice::from_raw_parts(
            core::ptr::addr_of!(TEXTURES).cast::<u8>(),
            TEXTURE_BYTES,
        );
        let output = core::ptr::addr_of_mut!(OUTPUT).cast::<u8>();

        for i in 0..PIXELS {
            let x = i % WIDTH;
            let y = i / WIDTH;
            let world_x = chunk_x * CHUNK_SIZE + x as i32 - MARGIN;
            let world_y = chunk_y * CHUNK_SIZE + y as i32 - MARGIN;
            let color = color(
                *terrain.add(i),
                world_x,
                world_y,
                *height.add(i) != 0,
                textures,
            );
            let out = output.add(i * 4);
            *out = color[0];
            *out.add(1) = color[1];
            *out.add(2) = color[2];
            *out.add(3) = 255;
        }
    }
}

fn hash(x: i32, y: i32) -> f64 {
    let mut h = x
        .wrapping_mul(374_761_393)
        .wrapping_add(y.wrapping_mul(668_265_263));
    h = (h ^ ((h as u32) >> 13) as i32).wrapping_mul(1_274_126_177);
    ((h ^ ((h as u32) >> 16) as i32) as u32) as f64 / 4_294_967_296.0
}

fn modulo(value: i32, divisor: i32) -> i32 {
    (value % divisor + divisor) % divisor
}

fn color(terrain: u8, x: i32, y: i32, high: bool, textures: &[u8]) -> [u8; 3] {
    let h = hash(x, y);
    let b = hash(x >> 2, y >> 2);
    let base = match terrain {
        0 => {
            if h < 0.005 {
                if b < 0.5 {
                    [255.0, 255.0, 255.0]
                } else {
                    [255.0, 214.0, 90.0]
                }
            } else if b < 0.2 {
                if high {
                    [130.0, 201.0, 100.0]
                } else {
                    [155.0, 204.0, 108.0]
                }
            } else if h < 0.1 {
                if high {
                    [78.0, 154.0, 63.0]
                } else {
                    [111.0, 162.0, 78.0]
                }
            } else if h < 0.55 {
                if high {
                    [95.0, 174.0, 74.0]
                } else {
                    [127.0, 179.0, 90.0]
                }
            } else if high {
                [109.0, 187.0, 85.0]
            } else {
                [140.0, 192.0, 99.0]
            }
        }
        1 => {
            if h < 0.14 {
                [205.0, 189.0, 152.0]
            } else {
                [216.0, 201.0, 166.0]
            }
        }
        2 => {
            if h < 0.05 {
                [78.0, 150.0, 58.0]
            } else if modulo(x / 21, 2) != 0 {
                [109.0, 187.0, 79.0]
            } else {
                [98.0, 173.0, 70.0]
            }
        }
        3 => {
            if h < 0.035 || (b < 0.1 && h < 0.3) {
                [127.0, 192.0, 236.0]
            } else if h < 0.07 {
                [47.0, 111.0, 174.0]
            } else {
                [61.0, 134.0, 198.0]
            }
        }
        4 => {
            let cell = hash(x >> 2, y >> 2);
            if x & 3 == 0 && y & 3 == 0 {
                [110.0, 170.0, 84.0]
            } else if cell < 0.3 {
                [39.0, 98.0, 48.0]
            } else if cell < 0.7 {
                [52.0, 122.0, 58.0]
            } else {
                [72.0, 144.0, 66.0]
            }
        }
        5 => {
            if modulo(x, 14) == 0 && modulo(y, 26) < 16 {
                [232.0, 232.0, 238.0]
            } else if h < 0.1 {
                [118.0, 122.0, 134.0]
            } else {
                [124.0, 128.0, 140.0]
            }
        }
        6 => {
            if modulo(x, 6) == 0 || modulo(y, 6) == 0 {
                [186.0, 178.0, 160.0]
            } else if h < 0.1 {
                [214.0, 206.0, 190.0]
            } else {
                [207.0, 199.0, 181.0]
            }
        }
        7 => {
            if h < 0.08 {
                [104.0, 109.0, 117.0]
            } else if h > 0.95 {
                [78.0, 82.0, 90.0]
            } else {
                [91.0, 96.0, 104.0]
            }
        }
        8 => {
            let row = y / 3;
            let fence = y % 3 == 0 || modulo(x + modulo(row, 2) * 3, 6) == 0;
            if fence {
                [168.0, 112.0, 78.0]
            } else if h < 0.15 {
                [203.0, 146.0, 102.0]
            } else {
                [212.0, 155.0, 110.0]
            }
        }
        9 => {
            if modulo(y, 2) != 0 {
                [191.0, 184.0, 168.0]
            } else {
                [156.0, 150.0, 134.0]
            }
        }
        10 => [246.0, 241.0, 210.0],
        11 => {
            if modulo(x, 6) == 0 {
                [84.0, 34.0, 24.0]
            } else if modulo(y, 6) < 2 {
                [198.0, 110.0, 78.0]
            } else {
                [148.0, 66.0, 48.0]
            }
        }
        _ => {
            if modulo(x + y, 9) == 0 {
                [141.0, 149.0, 163.0]
            } else if h < 0.1 {
                [170.0, 176.0, 188.0]
            } else {
                [179.0, 185.0, 196.0]
            }
        }
    };

    let Some((texture_index, weight)) = texture(terrain) else {
        return base.map(to_channel);
    };
    let cell_x = x >> 5;
    let cell_y = y >> 5;
    let random = hash(cell_x, cell_y);
    let u = x & 31;
    let v = y & 31;
    let a = if random < 0.5 { u } else { 31 - u };
    let b = if (random * 7.0) % 1.0 < 0.5 {
        v
    } else {
        31 - v
    };
    let index = if random > 0.25 && random < 0.75 {
        a * 32 + b
    } else {
        b * 32 + a
    };
    let detail = textures[texture_index * 1024 + index as usize] as f64 / 255.0 + 0.5;
    let factor = 1.0 + (detail - 1.0) * weight;
    base.map(|channel| to_channel((channel * factor).min(255.0)))
}

fn texture(terrain: u8) -> Option<(usize, f64)> {
    match terrain {
        0 | 2 => Some((0, 0.6)),
        1 => Some((1, 0.5)),
        3 => Some((2, 0.35)),
        4 => Some((3, 0.5)),
        5 => Some((4, 0.4)),
        6 => Some((5, 0.55)),
        7 => Some((6, 0.55)),
        8 => Some((7, 0.5)),
        9 => Some((8, 0.55)),
        _ => None,
    }
}

fn to_channel(value: f64) -> u8 {
    value.round_ties_even().clamp(0.0, 255.0) as u8
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn colorize_writes_a_full_opaque_chunk() {
        unsafe {
            core::ptr::addr_of_mut!(TERRAIN)
                .cast::<u8>()
                .write_bytes(10, PIXELS);
            core::ptr::addr_of_mut!(HEIGHT)
                .cast::<u8>()
                .write_bytes(0, PIXELS);
            core::ptr::addr_of_mut!(TEXTURES)
                .cast::<u8>()
                .write_bytes(0, TEXTURE_BYTES);
        }

        colorize(-2, 3);

        let output = unsafe {
            core::slice::from_raw_parts(
                core::ptr::addr_of!(OUTPUT).cast::<u8>(),
                PIXELS * 4,
            )
        };
        assert_eq!(output.len(), PIXELS * 4);
        assert!(output.chunks_exact(4).all(|pixel| pixel[3] == 255));
    }
}
