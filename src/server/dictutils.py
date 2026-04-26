"""
Utility functions for working with dictionaries.
"""

from typing import Any, Dict


def find_dict(root: Dict, path: str) -> Dict[Any, Any] | None:
    """
    Find a specific dictionary in a nested dictionary.

    The path is a string of keys separated by dots. For example, if the path is "a.b.c", the function
    will look for a dictionary at root["a"]["b"]["c"].

    If it finds it, it returns it. If it doesn't find it, it returns None.
    """
    # Traverse the dictionary according to the path
    for key in path.split("."):
        # If the current root is a dictionary, get the value for the current key and continue traversing. Otherwise, return None.
        if isinstance(root, Dict):
            value = root.get(key)
            if isinstance(value, Dict):
                root = value
                continue

    # If the final value is a dictionary, return it. Otherwise, return None.
    if isinstance(root, Dict):
        return root
    return None


def set_dict_value(root: Dict, path: str, value: Any) -> None:
    """
    Set a value in a specific dictionary.

    The path is a string of keys separated by dots. For example, if the path is "a.b.c", the function
    will set the value at root["a"]["b"]["c"] to the provided value.

    If the dictionary at the specified path does not exist, the function does nothing.
    """
    key = path.split(".")[-1]  # Last item
    d = find_dict(root, path)
    if isinstance(d, Dict) and key in d.keys():
        d[key] = value


def get_dict_value(root: Dict, path: str) -> Any | None:
    """
    Get a value from a specific dictionary.

    The path is a string of keys separated by dots. For example, if the path is "a.b.c", the function
    will return the value at root["a"]["b"]["c"].

    If the dictionary at the specified path does not exist, the function returns None.
    """
    key = path.split(".")[-1]  # Last item
    d = find_dict(root, path)
    if isinstance(d, Dict) and key in d.keys():
        return d[key]
    return None


def clear_dict(root: Dict):
    """
    Clear all non-dictionary values in a nested dictionary.

    This function modifies the dictionary in place. It traverses the dictionary recursively and
    sets all non-dictionary values to None.

    If the input is not a dictionary, it returns None.
    """
    # If the input is not a dictionary, return None
    if not isinstance(root, Dict):
        return None

    def clear(data: Dict):
        """
        Recursively clear all non-dictionary values in the dictionary.
        This function modifies the dictionary in place.
        It traverses the dictionary recursively and sets all non-dictionary values to None.

        If the input is not a dictionary, it returns None.
        """
        for k, v in list(data.items()):
            if isinstance(v, Dict):
                clear(v)
            if not isinstance(v, Dict):
                data[k] = None

    # Clear the dictionary and return it
    return clear(root)
